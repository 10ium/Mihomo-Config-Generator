// app.js

import ProtocolManager from './protocols/ProtocolManager.js';
import ConfigManager from './ConfigManager.js';
import MihomoConfigGenerator from './MihomoConfigGenerator.js';

new Vue({
    el: '#app',
    data: {
        currentTab: 'add-proxy',
        protocols: [],
        
        // --- تب افزودن پروکسی ---
        addProxyMethodTab: 'manual-entry', // 'manual-entry', 'file-upload', 'link-input'
        selectedProtocolName: '',
        currentProtocolFields: [],
        proxyTemplates: [],
        entryMethod: 'manual', // برای بخش دستی: 'manual' یا 'template'
        newProxy: {}, // مدل برای فرم افزودن پروکسی جدید (دستی)
        
        fileContent: '', // محتوای فایل آپلود شده
        linkInput: '', // متن یا لینک وارد شده
        detectedProxiesCount: 0, // تعداد پروکسی‌های شناسایی شده از فایل/لینک
        
        // --- تب پروکسی‌های من ---
        savedProxies: [],
        selectedMihomoProxyIds: [], // ID پروکسی‌های انتخاب شده برای تولید کانفیگ
        selectedProxiesForDeletion: [], // ID پروکسی‌های انتخاب شده برای حذف
        
        // --- تب ساخت کانفیگ MiHoMo ---
        mihomoTemplates: [],
        selectedMihomoTemplateName: '',
        mihomoMainPort: 7890,
        mihomoSocksPort: 7891,
        
        maxProxiesOutput: null, // حداکثر تعداد پروکسی در خروجی (null برای نامحدود)
        selectedOutputProtocols: [], // پروتکل‌های انتخاب شده برای خروجی نهایی
        allProtocolTypes: [], // لیست تمام نام پروتکل‌ها برای نمایش در فیلتر
        
        generatedConfigContent: '',
        
        // --- پیام‌ها ---
        message: '',
        messageType: '', // 'success', 'error', 'info'
        copySuccess: false,
    },
    mounted() {
        this.fetchProtocols();
        this.fetchSavedProxies(); // باید هنگام mount شدن همه رو fetch کنه
        this.fetchMihomoTemplates();
        this.allProtocolTypes = ProtocolManager.getAllProtocolNames();
        this.selectedOutputProtocols = [...this.allProtocolTypes]; // به طور پیش‌فرض همه را انتخاب کن
    },
    computed: {
        filteredProtocolFields() {
            return this.currentProtocolFields.filter(field => {
                if (field.dependency) {
                    const dependentFieldValue = this.newProxy[field.dependency.field];
                    return dependentFieldValue === field.dependency.value;
                }
                return true;
            });
        },
        // پروکسی‌های فیلتر شده بر اساس نوع پروتکل برای نمایش در تب "ساخت کانفیگ"
        filteredSavedProxiesForConfig() {
            return this.savedProxies.filter(proxy => 
                this.selectedOutputProtocols.includes(proxy.protocol_name)
            );
        }
    },
    methods: {
        // --- متدهای عمومی ---
        showMessage(msg, type) {
            this.message = msg;
            this.messageType = type;
            setTimeout(() => {
                this.message = '';
                this.messageType = '';
            }, 5000);
        },

        // --- متدهای مربوط به پروتکل‌ها ---
        fetchProtocols() {
            this.protocols = ProtocolManager.getAllProtocolNames();
        },
        async onProtocolChange() {
            this.currentProtocolFields = [];
            this.proxyTemplates = [];
            this.newProxy = {};
            this.entryMethod = 'manual';
            this.selectedTemplate = null;

            if (this.selectedProtocolName) {
                const protocolInstance = ProtocolManager.getProtocolByName(this.selectedProtocolName);
                if (protocolInstance) {
                    this.currentProtocolFields = protocolInstance.getConfigFields();
                    
                    this.currentProtocolFields.forEach(field => {
                        if (field.default !== undefined) {
                            this.$set(this.newProxy, field.id, field.default);
                        } else {
                            this.$set(this.newProxy, field.id, field.type === 'number' ? null : '');
                        }
                    });

                    this.proxyTemplates = protocolInstance.getDefaultProxyTemplates();
                } else {
                    this.showMessage('پروتکل انتخاب شده یافت نشد.', 'error');
                }
            }
        },
        applyTemplate() {
            if (this.selectedTemplate) {
                const updatedProxy = { ...this.newProxy };
                this.currentProtocolFields.forEach(field => {
                    const templateValue = this.selectedTemplate.values[field.id];
                    if (templateValue !== undefined) {
                        this.$set(updatedProxy, field.id, field.type === 'checkbox' ? Boolean(templateValue) : templateValue);
                    } else if (field.default !== undefined) {
                        this.$set(updatedProxy, field.id, field.type === 'checkbox' ? Boolean(field.default) : field.default);
                    } else {
                        this.$set(updatedProxy, field.id, field.type === 'number' ? null : '');
                    }
                });
                this.newProxy = updatedProxy;
            }
        },

        // --- متدهای مربوط به افزودن پروکسی ---
        async addProxy() {
            for (const field of this.currentProtocolFields) {
                if (field.required && (this.newProxy[field.id] === null || this.newProxy[field.id] === undefined || this.newProxy[field.id] === '')) {
                    this.showMessage(`فیلد '${field.label}' اجباری است.`, 'error');
                    return;
                }
            }

            const proxyToAdd = { ...this.newProxy, protocol_name: this.selectedProtocolName };
            this.addProxyToSavedList(proxyToAdd);
        },

        handleFileUpload(event) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                this.fileContent = e.target.result;
                this.parseAndAddProxies(this.fileContent, "File");
            };
            reader.onerror = (e) => {
                this.showMessage('خطا در خواندن فایل.', 'error');
                console.error('File reading error:', e);
            };
            reader.readAsText(file);
        },

        addProxiesFromLinkOrText() {
            this.parseAndAddProxies(this.linkInput, "Link/Text");
        },

        parseAndAddProxies(content, sourceName = "Unknown Source") {
            let decodedContent = content;
            this.detectedProxiesCount = 0; // ریست شمارنده

            try {
                if (Base64.isValid(content)) {
                    decodedContent = Base64.decode(content);
                    this.showMessage(`محتوا به عنوان Base64 شناسایی و رمزگشایی شد.`, 'success');
                }
            } catch (e) {
                console.warn("محتوا Base64 معتبر نیست یا خطا در دیکدینگ:", e);
            }
            
            let proxiesToAdd = [];
            
            try {
                const parsedYaml = jsyaml.load(decodedContent);
                if (parsedYaml && Array.isArray(parsedYaml.proxies)) {
                    proxiesToAdd = parsedYaml.proxies;
                    this.showMessage(`پروکسی‌ها از فایل/متن YAML معتبر استخراج شدند.`, 'success');
                } else if (parsedYaml && parsedYaml.type && parsedYaml.server && parsedYaml.port) {
                    proxiesToAdd.push(parsedYaml);
                    this.showMessage(`یک پروکسی از فایل/متن YAML معتبر استخراج شد.`, 'success');
                } else {
                    console.log("محتوای YAML/JSON معتبر نیست یا شامل لیست پروکسی‌ها نیست.");
                }
            } catch (e) {
                console.log("محتوا YAML/JSON معتبر نیست. تلاش برای استخراج لینک‌ها...", e);
            }

            if (proxiesToAdd.length === 0) {
                const lines = decodedContent.split('\n').map(line => line.trim()).filter(line => line.length > 0);
                for (const line of lines) {
                    let proxy = null;
                    if (line.startsWith("socks5://")) {
                        proxy = this.parseSocks5Link(line);
                    } else if (line.startsWith("http://") || line.startsWith("https://")) {
                        proxy = this.parseHttpLink(line);
                    }
                    if (proxy) {
                        proxiesToAdd.push(proxy);
                    } else {
                        console.warn(`خط/لینک ناشناخته/نامعتبر: ${line}`);
                    }
                }
            }

            this.detectedProxiesCount = proxiesToAdd.length;

            if (this.detectedProxiesCount === 0) {
                this.showMessage('هیچ پروکسی معتبری از محتوای وارد شده یافت نشد. فرمت را بررسی کنید.', 'error');
                return;
            }

            let addedCount = 0;
            for (const proxy of proxiesToAdd) {
                if (!proxy.type) {
                    console.warn(`پروکسی بدون نوع (type) نادیده گرفته شد:`, proxy);
                    continue;
                }
                
                const protocolInstance = ProtocolManager.getProtocolByName(proxy.type.toUpperCase());
                if (!protocolInstance) {
                    console.warn(`پروتکل '${proxy.type}' پشتیبانی نمی‌شود و پروکسی نادیده گرفته شد:`, proxy);
                    continue;
                }

                const configData = { protocol_name: protocolInstance.getName() };
                const fields = protocolInstance.getConfigFields();
                
                fields.forEach(field => {
                    if (proxy[field.id] !== undefined) {
                        configData[field.id] = proxy[field.id];
                    } else if (field.default !== undefined) {
                        configData[field.id] = field.default;
                    }
                });
                
                if (proxy.headers && typeof proxy.headers === 'object') {
                    configData.headers = JSON.stringify(proxy.headers);
                }

                this.addProxyToSavedList(configData);
                addedCount++;
            }

            if (addedCount > 0) {
                this.showMessage(`${addedCount} پروکسی با موفقیت اضافه شد.`, 'success');
                this.fileContent = '';
                this.linkInput = '';
            } else {
                this.showMessage('هیچ پروکسی معتبری برای افزودن یافت نشد.', 'error');
            }
        },

        parseSocks5Link(link) {
            try {
                const url = new URL(link);
                const proxy = {
                    type: "socks5",
                    server: url.hostname,
                    port: parseInt(url.port)
                };
                if (url.username) proxy.username = decodeURIComponent(url.username);
                if (url.password) proxy.password = decodeURIComponent(url.password);

                const params = new URLSearchParams(url.search);
                if (params.get('tls')) proxy.tls = params.get('tls').toLowerCase() === 'true';
                if (params.get('skip-cert-verify')) proxy['skip-cert-verify'] = params.get('skip-cert-verify').toLowerCase() === 'true';
                if (params.get('udp')) proxy.udp = params.get('udp').toLowerCase() === 'true';
                if (params.get('ip-version')) proxy['ip-version'] = params.get('ip-version');
                if (params.get('fingerprint')) proxy.fingerprint = params.get('fingerprint');

                proxy.name = proxy.name || `SOCKS5-${proxy.server}:${proxy.port}`;
                return proxy;
            } catch (e) {
                console.error("خطا در تجزیه لینک SOCKS5:", link, e);
                return null;
            }
        },

        parseHttpLink(link) {
            try {
                const url = new URL(link);
                const proxy = {
                    type: "http",
                    server: url.hostname,
                    port: parseInt(url.port)
                };
                if (url.username) proxy.username = decodeURIComponent(url.username);
                if (url.password) proxy.password = decodeURIComponent(url.password);

                proxy.tls = url.protocol === 'https:';

                const params = new URLSearchParams(url.search);
                if (params.get('skip-cert-verify')) proxy['skip-cert-verify'] = params.get('skip-cert-verify').toLowerCase() === 'true';
                if (params.get('sni')) proxy.sni = params.get('sni');
                if (params.get('fingerprint')) proxy.fingerprint = params.get('fingerprint');
                if (params.get('ip-version')) proxy['ip-version'] = params.get('ip-version');
                if (params.get('headers')) {
                    try {
                        proxy.headers = JSON.parse(decodeURIComponent(params.get('headers')));
                    } catch (e) {
                        console.warn("هدرهای JSON در لینک نامعتبر است:", params.get('headers'));
                    }
                }

                proxy.name = proxy.name || `HTTP-${proxy.server}:${proxy.port}`;
                return proxy;
            } catch (e) {
                console.error("خطا در تجزیه لینک HTTP:", link, e);
                return null;
            }
        },

        addProxyToSavedList(proxyData) {
            let finalName = proxyData.name;
            let counter = 1;
            while (this.savedProxies.some(p => p.name === finalName)) {
                finalName = `${proxyData.name} ${counter}`;
                counter++;
            }
            proxyData.name = finalName;

            if (ConfigManager.addConfig(proxyData)) {
                this.showMessage('پروکسی با موفقیت اضافه شد!', 'success');
                this.fetchSavedProxies();
                if (this.addProxyMethodTab === 'manual-entry') {
                    this.resetAddProxyForm();
                }
            } else {
                this.showMessage('خطا در افزودن پروکسی.', 'error');
            }
        },

        // --- متدهای مربوط به مدیریت پروکسی‌ها (در تب "پروکسی‌های من") ---
        fetchSavedProxies() {
            this.savedProxies = ConfigManager.getAllConfigs();
        },
        // حذف یک پروکسی (متد قبلی)
        deleteProxy(id) {
            if (!confirm('آیا مطمئن هستید که می‌خواهید این پروکسی را حذف کنید؟')) {
                return;
            }
            if (ConfigManager.deleteConfig(id)) {
                this.showMessage('پروکسی با موفقیت حذف شد.', 'success');
                this.fetchSavedProxies();
                // مطمئن شو که اگر حذف شد، از لیست انتخاب شده هم پاک بشه
                this.selectedMihomoProxyIds = this.selectedMihomoProxyIds.filter(proxyId => proxyId !== id);
                this.selectedProxiesForDeletion = this.selectedProxiesForDeletion.filter(proxyId => proxyId !== id);
            } else {
                this.showMessage('خطا در حذف پروکسی.', 'error');
            }
        },
        // انتخاب همه پروکسی‌ها برای تولید کانفیگ
        selectAllProxiesForMihomo() {
            this.selectedMihomoProxyIds = this.savedProxies.map(proxy => proxy.id);
        },
        // لغو انتخاب همه پروکسی‌ها برای تولید کانفیگ
        clearAllProxiesForMihomo() {
            this.selectedMihomoProxyIds = [];
        },
        // انتخاب همه پروکسی‌ها برای حذف
        selectAllProxiesForDeletion() {
            this.selectedProxiesForDeletion = this.savedProxies.map(proxy => proxy.id);
        },
        // لغو انتخاب همه پروکسی‌ها برای حذف
        clearAllProxiesForDeletion() {
            this.selectedProxiesForDeletion = [];
        },
        // حذف پروکسی‌های انتخاب شده
        deleteSelectedProxies() {
            if (!this.selectedProxiesForDeletion.length) {
                this.showMessage('هیچ پروکسی برای حذف انتخاب نشده است.', 'info');
                return;
            }
            if (!confirm(`آیا مطمئن هستید که می‌خواهید ${this.selectedProxiesForDeletion.length} پروکسی انتخاب شده را حذف کنید؟`)) {
                return;
            }
            let deletedCount = 0;
            for (const id of this.selectedProxiesForDeletion) {
                if (ConfigManager.deleteConfig(id)) {
                    deletedCount++;
                } else {
                    console.warn(`خطا در حذف پروکسی با ID: ${id}`);
                }
            }
            if (deletedCount > 0) {
                this.showMessage(`${deletedCount} پروکسی با موفقیت حذف شد.`, 'success');
                this.fetchSavedProxies(); // رفرش لیست
                this.selectedMihomoProxyIds = this.selectedMihomoProxyIds.filter(id => !this.selectedProxiesForDeletion.includes(id));
                this.selectedProxiesForDeletion = []; // خالی کردن لیست حذف
            } else {
                this.showMessage('خطا در حذف پروکسی‌ها.', 'error');
            }
        },

        // --- متدهای مربوط به تولید کانفیگ MiHoMo ---
        fetchMihomoTemplates() {
            this.mihomoTemplates = MihomoConfigGenerator.getAvailableTemplates();
            if (this.mihomoTemplates.includes('full_rules')) {
                this.selectedMihomoTemplateName = 'full_rules';
            } else if (this.mihomoTemplates.length > 0) {
                this.selectedMihomoTemplateName = this.mihomoTemplates[0];
            }
        },
        generateMihomoConfig() {
            if (!this.selectedMihomoProxyIds.length) {
                this.showMessage('لطفاً حداقل یک پروکسی برای ساخت کانفیگ انتخاب کنید.', 'error');
                return;
            }
            if (!this.selectedMihomoTemplateName) {
                this.showMessage('لطفاً یک تمپلت قوانین MiHoMo را انتخاب کنید.', 'error');
                return;
            }

            let proxiesToInclude = [];
            
            for (const p_id of this.selectedMihomoProxyIds) {
                const proxyData = ConfigManager.getConfigById(p_id);
                if (proxyData && this.selectedOutputProtocols.includes(proxyData.protocol_name)) {
                    const protocolInstance = ProtocolManager.getProtocolByName(proxyData.protocol_name);
                    if (protocolInstance) {
                        proxiesToInclude.push(protocolInstance.generateMihomoProxyConfig(proxyData));
                    } else {
                        console.warn(`پروتکل '${proxyData.protocol_name}' برای پروکسی ID ${p_id} یافت نشد. این پروکسی نادیده گرفته شد.`);
                    }
                } else if (proxyData && !this.selectedOutputProtocols.includes(proxyData.protocol_name)) {
                    console.warn(`پروکسی ID ${p_id} (پروتکل ${proxyData.protocol_name}) به دلیل فیلتر پروتکل‌ها نادیده گرفته شد.`);
                } else {
                    console.warn(`پروکسی با ID ${p_id} یافت نشد و نادیده گرفته شد.`);
                }
            }
            
            if (!proxiesToInclude.length) {
                 this.showMessage("هیچ پروکسی معتبری برای تولید کانفیگ MiHoMo یافت نشد. فیلترها را بررسی کنید.", 'error');
                 this.generatedConfigContent = '';
                 return;
            }

            if (this.maxProxiesOutput !== null && this.maxProxiesOutput > 0 && proxiesToInclude.length > this.maxProxiesOutput) {
                proxiesToInclude = proxiesToInclude.slice(0, this.maxProxiesOutput);
                this.showMessage(`تعداد پروکسی‌ها به ${this.maxProxiesOutput} محدود شد.`, 'info');
            }


            const configContent = MihomoConfigGenerator.generateConfig(
                this.selectedMihomoTemplateName,
                proxiesToInclude,
                this.mihomoMainPort,
                this.mihomoSocksPort
            );

            if (configContent) {
                this.generatedConfigContent = configContent;
                this.showMessage('کانفیگ MiHoMo با موفقیت تولید شد!', 'success');
            } else {
                this.showMessage('خطا در تولید کانفیگ MiHoMo.', 'error');
                this.generatedConfigContent = '';
            }
        },
        downloadConfig() {
            if (this.generatedConfigContent) {
                const blob = new Blob([this.generatedConfigContent], { type: 'application/x-yaml' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'config.yaml';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        },
        copyConfig() {
            if (this.generatedConfigContent) {
                navigator.clipboard.writeText(this.generatedConfigContent)
                    .then(() => {
                        this.copySuccess = true;
                        setTimeout(() => this.copySuccess = false, 2000);
                    })
                    .catch(err => {
                        console.error('Could not copy text: ', err);
                        this.showMessage('خطا در کپی کردن کانفیگ.', 'error');
                    });
            }
        },
        selectAllProtocols() {
            this.selectedOutputProtocols = [...this.allProtocolTypes];
        },
        clearAllProtocols() {
            this.selectedOutputProtocols = [];
        }
    },
    watch: {
        currentTab(newTab) {
            if (newTab === 'protocols') {
                this.fetchProtocols();
            } else if (newTab === 'view-proxies') {
                this.fetchSavedProxies();
                // ریست انتخاب ها هنگام ورود به تب پروکسی‌های من
                this.selectedMihomoProxyIds = [];
                this.selectedProxiesForDeletion = [];
            } else if (newTab === 'generate-config') {
                this.fetchSavedProxies();
                this.fetchMihomoTemplates();
                this.generatedConfigContent = '';
                this.maxProxiesOutput = null; 
                this.selectedOutputProtocols = [...this.allProtocolTypes]; 
            } else if (newTab === 'add-proxy') {
                this.resetAddProxyForm();
                this.detectedProxiesCount = 0;
                this.fileContent = '';
                this.linkInput = '';
            }
        }
    }
});
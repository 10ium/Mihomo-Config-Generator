// app.js (نسخه نهایی اصلاح شده)

import ProtocolManager from './protocols/ProtocolManager.js';
import ConfigManager from './ConfigManager.js';
import MihomoConfigGenerator from './MihomoConfigGenerator.js';
import LinkParser from './protocols/LinkParser.js';

new Vue({
    el: '#app',
    data: {
        currentTab: 'add-proxy', // تب پیش‌فرض هنگام بارگذاری صفحه
        protocols: [], // لیست نام پروتکل‌های موجود (مثل HTTP, SOCKS5)
        
        // --- تب افزودن پروکسی ---
        addProxyMethodTab: 'manual-entry', // 'manual-entry', 'file-upload', 'link-input', 'clipboard-paste'
        selectedProtocolName: '',
        currentProtocolFields: [],
        proxyTemplates: [],
        entryMethod: 'manual', // برای بخش دستی: 'manual' یا 'template'
        newProxy: {}, // مدل برای فرم افزودن پروکسی جدید (دستی)
        
        fileContent: '', // محتوای فایل آپلود شده
        linkInput: '', // متن یا لینک وارد شده (برای ورودی دستی و لینک)
        clipboardContent: '', // محتوای کلیپ‌بورد
        detectedProxiesCount: 0, // تعداد پروکسی‌های شناسایی شده از فایل/لینک/کلیپ‌بورد
        
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
        protocolCounts: {}, // تعداد پروکسی‌ها برای هر پروتکل (مثال: { "VLESS": 10, "SS": 5 })
        
        generatedConfigContent: '',
        
        // --- پیام‌ها ---
        message: '',
        messageType: '', // 'success', 'error', 'info'
        copySuccess: false,
    },
    mounted() {
        // این متد وقتی کامپوننت Vue بارگذاری شد فراخوانی میشه
        this.fetchProtocols(); // بارگذاری پروتکل‌ها از ProtocolManager
        this.fetchSavedProxies(); // بارگذاری پروکسی‌های ذخیره شده از ConfigManager
        this.fetchMihomoTemplates(); // بارگذاری تمپلت‌های Mihomo از MihomoConfigGenerator
        this.allProtocolTypes = ProtocolManager.getAllProtocolNames(); // دریافت همه پروتکل‌ها برای فیلتر
        this.selectedOutputProtocols = [...this.allProtocolTypes]; // به طور پیش‌فرض همه را انتخاب کن
    },
    computed: {
        // فیلتر کردن فیلدها بر اساس وابندگی
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
            // این تابع اکنون فقط برای نمایش در UI استفاده می شود، نه برای فیلتر نهایی تولید کانفیگ
            return this.savedProxies.filter(proxy => 
                this.selectedOutputProtocols.includes(proxy.protocol_name)
            );
        },
        // پروتکل‌هایی که حداقل یک پروکسی ذخیره شده دارند
        protocolsWithSavedProxies() {
            return this.allProtocolTypes.filter(pName => this.protocolCounts[pName] > 0);
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
                    
                    // مقداردهی اولیه newProxy با مقادیر پیش‌فرض فیلدها
                    this.currentProtocolFields.forEach(field => {
                        if (field.default !== undefined) {
                            // اگر فیلد textarea است و مقدار پیش‌فرض آن شیء یا آرایه است، آن را به رشته JSON تبدیل کن
                            if (field.type === 'textarea' && (typeof field.default === 'object' && field.default !== null || Array.isArray(field.default))) {
                                this.$set(this.newProxy, field.id, JSON.stringify(field.default));
                            } else {
                                this.$set(this.newProxy, field.id, field.default);
                            }
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
                        if (field.type === 'checkbox') {
                            this.$set(updatedProxy, field.id, Boolean(templateValue));
                        } else if (field.type === 'textarea' && (typeof templateValue === 'object' && templateValue !== null || Array.isArray(templateValue))) {
                            this.$set(updatedProxy, field.id, JSON.stringify(templateValue));
                        } else {
                            this.$set(updatedProxy, field.id, templateValue);
                        }
                    } else if (field.default !== undefined) {
                        if (field.type === 'checkbox') {
                            this.$set(updatedProxy, field.id, Boolean(field.default));
                        } else if (field.type === 'textarea' && (typeof field.default === 'object' && field.default !== null || Array.isArray(field.default))) {
                            this.$set(updatedProxy, field.id, JSON.stringify(field.default));
                        } else {
                            this.$set(updatedProxy, field.id, field.default);
                        }
                    } else {
                        this.$set(updatedProxy, field.id, field.type === 'number' ? null : '');
                    }
                });
                this.newProxy = updatedProxy;
            }
        },

        // --- متدهای مربوط به افزودن پروکسی ---
        async addProxy() {
            // این متد برای دکمه "افزودن پروکسی" در تب دستی استفاده می‌شود
            // اعتبارسنجی ساده سمت فرانت‌اند
            for (const field of this.currentProtocolFields) {
                if (field.required && (this.newProxy[field.id] === null || this.newProxy[field.id] === undefined || this.newProxy[field.id] === '')) {
                    this.showMessage(`فیلد '${field.label}' اجباری است.`, 'error');
                    return;
                }
            }

            const proxyToAdd = { ...this.newProxy, protocol_name: this.selectedProtocolName };
            this.addProxyToSavedList(proxyToAdd); // فراخوانی تابع مرکزی افزودن
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

        async fetchProxiesFromLink() {
            if (!this.linkInput) {
                this.showMessage('لطفاً یک لینک یا متن وارد کنید.', 'error');
                return;
            }

            let contentToParse = this.linkInput;

            // Try to convert GitHub URL to raw URL
            if (this.linkInput.includes('github.com') && !this.linkInput.includes('raw.githubusercontent.com')) {
                const rawUrl = LinkParser.getGitHubRawUrl(this.linkInput);
                if (rawUrl) {
                    contentToParse = rawUrl;
                    this.showMessage('لینک GitHub به فرمت raw تبدیل شد. در حال دریافت محتوا...', 'info');
                }
            }

            // Fetch content if it's a URL
            if (contentToParse.startsWith('http://') || contentToParse.startsWith('https://')) {
                try {
                    const response = await fetch(contentToParse);
                    if (!response.ok) {
                        throw new Error(`خطا در دریافت لینک: ${response.statusText}`);
                    }
                    const text = await response.text();
                    this.parseAndAddProxies(text, "Link");
                } catch (e) {
                    this.showMessage(`خطا در دریافت محتوا از لینک: ${e.message}`, 'error');
                    console.error('Fetch error:', e);
                }
            } else {
                // If not a URL, treat as direct text input
                this.parseAndAddProxies(contentToParse, "Text Input");
            }
        },

        handlePasteFromClipboard() {
            navigator.clipboard.readText()
                .then(text => {
                    this.clipboardContent = text;
                    this.parseAndAddProxies(this.clipboardContent, "Clipboard");
                })
                .catch(err => {
                    this.showMessage('خطا در خواندن از کلیپ‌بورد. لطفاً دسترسی کلیپ‌بورد را تأیید کنید.', 'error');
                    console.error('Failed to read clipboard contents: ', err);
                });
        },

        parseAndAddProxies(content, sourceName = "Unknown Source") {
            let decodedContent = content;
            this.detectedProxiesCount = 0; // ریست شمارنده

            // 1. تشخیص و دیکد کردن Base64
            try {
                if (Base64.isValid(content)) {
                    decodedContent = Base64.decode(content);
                    this.showMessage(`محتوا به عنوان Base64 شناسایی و رمزگشایی شد.`, 'success');
                }
            } catch (e) {
                console.warn("محتوا Base64 معتبر نیست یا خطا در دیکدینگ:", e);
            }
            
            let proxiesFromInput = []; // نام تغییر کرده برای وضوح
            
            // 2. تلاش برای parsing YAML/JSON
            try {
                const parsedYaml = jsyaml.load(decodedContent);
                if (parsedYaml && Array.isArray(parsedYaml.proxies)) {
                    proxiesFromInput = parsedYaml.proxies;
                    this.showMessage(`پروکسی‌ها از فایل/متن YAML معتبر استخراج شدند.`, 'success');
                } else if (parsedYaml && parsedYaml.type && parsedYaml.server && parsedYaml.port) {
                    proxiesFromInput.push(parsedYaml);
                    this.showMessage(`یک پروکسی از فایل/متن YAML معتبر استخراج شد.`, 'success');
                } else {
                    console.log("محتوای YAML/JSON معتبر نیست یا شامل لیست پروکسی‌ها نیست.");
                }
            } catch (e) {
                console.log("محتوا YAML/JSON معتبر نیست. تلاش برای استخراج لینک‌ها...", e);
            }

            // 3. تلاش برای استخراج از لینک‌های اشتراک (Vmess, Shadowsocks, ...)
            if (proxiesFromInput.length === 0) { // اگر از YAML چیزی استخراج نشد
                const lines = decodedContent.split('\n').map(line => line.trim()).filter(line => line.length > 0);
                for (const line of lines) {
                    // استفاده از LinkParser برای تجزیه لینک‌ها
                    const proxy = LinkParser.parse(line); // <-- استفاده از LinkParser
                    
                    if (proxy) {
                        proxiesFromInput.push(proxy);
                    } else {
                        console.warn(`خط/لینک ناشناخته/نامعتبر: ${line}`);
                    }
                }
            }

            this.detectedProxiesCount = proxiesFromInput.length;

            if (this.detectedProxiesCount === 0) {
                this.showMessage('هیچ پروکسی معتبری از محتوای وارد شده یافت نشد. فرمت را بررسی کنید.', 'error');
                return;
            }

            let addedCount = 0;
            let duplicateCount = 0; // شمارنده جدید برای موارد تکراری
            for (const proxy of proxiesFromInput) {
                if (!proxy.type) {
                    console.warn(`پروکسی بدون نوع (type) نادیده گرفته شد:`, proxy);
                    continue;
                }
                
                const protocolInstance = ProtocolManager.getProtocolByName(proxy.type.toUpperCase()); // تبدیل 'socks5' به 'SOCKS5'
                if (!protocolInstance) {
                    console.warn(`پروتکل '${proxy.type}' پشتیبانی نمی‌شود و پروکسی نادیده گرفته شد:`, proxy);
                    continue;
                }

                // ساخت آبجکت configData با استفاده از فیلدهای پروتکل
                const configData = { protocol_name: protocolInstance.getName() };
                const fields = protocolInstance.getConfigFields();
                
                fields.forEach(field => {
                    const mihomoKey = field.id; // اکثر IDهای فیلدها با کلیدهای Mihomo یکی هستند
                    if (proxy[mihomoKey] !== undefined) {
                        // تبدیل نوع برای boolean
                        if (field.type === 'checkbox') {
                            configData[field.id] = Boolean(proxy[mihomoKey]);
                        } 
                        // تبدیل نوع برای number
                        else if (field.type === 'number') {
                            configData[field.id] = parseInt(proxy[mihomoKey]);
                        }
                        // برای headers, alpn, reality-opts, ws-opts, grpc-opts, smux, ech-opts, brutal-opts باید از JSON.stringify استفاده کنیم
                        // اگر مقدار از قبل یک آبجکت است، آن را به رشته JSON تبدیل می‌کنیم.
                        else if (['headers', 'alpn', 'reality-opts', 'ws-opts', 'grpc-opts', 'smux', 'ech-opts', 'brutal-opts', 'h2-opts', 'http-opts', 'plugin-opts', 'amnezia-wg-option', 'peers', 'allowed-ips', 'reserved', 'dns', 'host-key', 'host-key-algorithms', 'ss-opts', 'obfs-opts'].includes(field.id) && typeof proxy[mihomoKey] === 'object') {
                            configData[field.id] = JSON.stringify(proxy[mihomoKey]);
                        }
                        else {
                            configData[field.id] = proxy[mihomoKey];
                        }
                    } else if (field.default !== undefined) {
                        // اگر مقدار پیش‌فرض یک شیء/آرایه است، آن را به رشته JSON تبدیل کن
                        if (field.type === 'textarea' && (typeof field.default === 'object' && field.default !== null || Array.isArray(field.default))) {
                            configData[field.id] = JSON.stringify(field.default);
                        } else if (field.type === 'checkbox') { // Ensure boolean defaults are handled
                            configData[field.id] = Boolean(field.default);
                        }
                        else {
                            configData[field.id] = field.default;
                        }
                    }
                });

                // تنظیم نام پیش فرض در صورت نبود
                if (!configData.name) {
                    configData.name = `Auto-Imported-${protocolInstance.getName()}-${configData.server}:${configData.name || configData.port}`;
                }

                // افزودن به لیست ذخیره شده (ConfigManager مسئول بررسی تکراری بودن است)
                if (ConfigManager.addConfig(configData)) {
                    addedCount++;
                } else {
                    duplicateCount++;
                }
            }

            this.fetchSavedProxies(); // رفرش لیست بعد از افزودن
            
            let message = '';
            if (addedCount > 0) {
                message += `${addedCount} پروکسی جدید با موفقیت اضافه شد. `;
            }
            if (duplicateCount > 0) {
                message += `${duplicateCount} پروکسی تکراری نادیده گرفته شد.`;
            }
            if (addedCount === 0 && duplicateCount === 0) {
                message = 'هیچ پروکسی معتبری برای اضافه کردن یافت نشد.';
                this.showMessage(message, 'error');
            } else {
                this.showMessage(message, 'success');
            }
            this.fileContent = '';
            this.linkInput = '';
            this.clipboardContent = ''; // Clear clipboard content after parsing
        },

        // --- مدیریت پروکسی‌های ذخیره شده ---
        fetchSavedProxies() {
            this.savedProxies = ConfigManager.getAllConfigs();
            // محاسبه تعداد پروکسی‌ها بر اساس پروتکل
            this.protocolCounts = {};
            this.allProtocolTypes.forEach(pName => {
                this.protocolCounts[pName] = 0;
            });
            this.savedProxies.forEach(proxy => {
                if (this.protocolCounts[proxy.protocol_name] !== undefined) {
                    this.protocolCounts[proxy.protocol_name]++;
                }
            });

            // انتخاب همه پروکسی‌ها به صورت پیش‌فرض هنگام بارگذاری
            this.selectedMihomoProxyIds = this.savedProxies.map(proxy => proxy.id);
            // فیلتر کردن selectedOutputProtocols برای نمایش فقط پروتکل‌هایی که پروکسی دارند
            this.selectedOutputProtocols = this.allProtocolTypes.filter(pName => this.protocolCounts[pName] > 0);
        },
        deleteProxy(id) {
            // استفاده از یک modal سفارشی به جای confirm()
            this.showConfirmModal('آیا مطمئن هستید که می‌خواهید این پروکسی را حذف کنید؟', () => {
                if (ConfigManager.deleteConfig(id)) {
                    this.showMessage('پروکسی با موفقیت حذف شد.', 'success');
                    this.fetchSavedProxies();
                    // مطمئن شو که اگر حذف شد، از لیست انتخاب شده هم پاک بشه
                    this.selectedMihomoProxyIds = this.selectedMihomoProxyIds.filter(proxyId => proxyId !== id);
                    this.selectedProxiesForDeletion = this.selectedProxiesForDeletion.filter(proxyId => proxyId !== id);
                } else {
                    this.showMessage('خطا در حذف پروکسی.', 'error');
                }
            });
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
            this.showConfirmModal(`آیا مطمئن هستید که می‌خواهید ${this.selectedProxiesForDeletion.length} پروکسی انتخاب شده را حذف کنید؟`, () => {
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
            });
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
                this.generatedConfigContent = ''; // Clear content on error
                return;
            }
            if (!this.selectedMihomoTemplateName) {
                this.showMessage('لطفاً یک تمپلت قوانین MiHoMo را انتخاب کنید.', 'error');
                this.generatedConfigContent = ''; // Clear content on error
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
                // Create a temporary textarea to hold the content
                const textarea = document.createElement('textarea');
                textarea.value = this.generatedConfigContent;
                textarea.style.position = 'fixed'; // Prevents scrolling to bottom of page
                textarea.style.opacity = 0; // Hide it
                document.body.appendChild(textarea);
                textarea.focus();
                textarea.select(); // Select the content

                try {
                    document.execCommand('copy'); // Use document.execCommand('copy') for better iframe compatibility
                    this.copySuccess = true;
                    this.showMessage('کانفیگ با موفقیت کپی شد!', 'success');
                } catch (err) {
                    console.error('Failed to copy text: ', err);
                    this.showMessage('خطا در کپی کردن کانفیگ.', 'error');
                } finally {
                    document.body.removeChild(textarea); // Clean up the temporary textarea
                    setTimeout(() => this.copySuccess = false, 2000);
                }
            }
        },
        selectAllProtocols() {
            this.selectedOutputProtocols = [...this.allProtocolTypes];
        },
        clearAllProtocols() {
            this.selectedOutputProtocols = [];
        },
        resetAddProxyForm() {
            this.selectedProtocolName = '';
            this.currentProtocolFields = [];
            this.proxyTemplates = [];
            this.newProxy = {};
            this.entryMethod = 'manual';
            this.selectedTemplate = null;
        },
        // متد جدید برای نمایش modal تایید
        showConfirmModal(message, callback) {
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50'; // Fixed typo: bg-opacity50 -> bg-opacity-50
            modal.innerHTML = `
                <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
                    <p class="text-gray-800 text-lg mb-6">${message}</p>
                    <div class="flex justify-center gap-4">
                        <button id="confirm-yes" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            بله
                        </button>
                        <button id="confirm-no" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            خیر
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            document.getElementById('confirm-yes').onclick = () => {
                callback();
                document.body.removeChild(modal);
            };
            document.getElementById('confirm-no').onclick = () => {
                document.body.removeChild(modal);
            };
        }
    },
    watch: {
        currentTab(newTab) {
            if (newTab === 'protocols') {
                this.fetchProtocols();
            } else if (newTab === 'view-proxies') {
                this.fetchSavedProxies();
                // ریست انتخاب ها هنگام ورود به تب پروکسی‌های من
                this.selectedProxiesForDeletion = []; // فقط انتخاب‌های حذف را ریست می‌کنیم
                // selectedMihomoProxyIds در fetchSavedProxies() تنظیم می‌شود
            } else if (newTab === 'generate-config') {
                this.fetchSavedProxies(); // لیست پروکسی‌ها را بارگذاری می‌کند و همه را انتخاب می‌کند
                this.mihomoTemplates = MihomoConfigGenerator.getAvailableTemplates(); // Ensure templates are fetched
                if (this.mihomoTemplates.includes('full_rules')) {
                    this.selectedMihomoTemplateName = 'full_rules';
                } else if (this.mihomoTemplates.length > 0) {
                    this.selectedMihomoTemplateName = this.mihomoTemplates[0];
                }
                this.generatedConfigContent = '';
                this.maxProxiesOutput = null;
                // هنگام ورود به تب ساخت کانفیگ، فقط پروتکل‌هایی که پروکسی دارند انتخاب شوند
                this.selectedOutputProtocols = this.allProtocolTypes.filter(pName => this.protocolCounts[pName] > 0);
            } else if (newTab === 'add-proxy') {
                this.resetAddProxyForm();
                this.detectedProxiesCount = 0;
                this.fileContent = '';
                this.linkInput = '';
                this.clipboardContent = '';
            }
        }
    }
});

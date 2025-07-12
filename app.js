// app.js

import ProtocolManager from './protocols/ProtocolManager.js';
import ConfigManager from './ConfigManager.js';
import MihomoConfigGenerator from './MihomoConfigGenerator.js';

new Vue({
    el: '#app', // این Vue.js رو به div#app در index.html متصل می‌کنه
    data: {
        currentTab: 'add-proxy', // تب پیش‌فرض هنگام بارگذاری صفحه
        protocols: [], // لیست نام پروتکل‌های موجود (مثل HTTP, SOCKS5)
        
        // داده‌های مربوط به تب "افزودن پروکسی"
        selectedProtocolName: '', // نام پروتکل انتخاب شده توسط کاربر برای افزودن پروکسی
        currentProtocolFields: [], // فیلدهای کانفیگ مربوط به پروتکل انتخاب شده
        proxyTemplates: [], // تمپلت‌های پروکسی پیش‌فرض برای پروتکل انتخاب شده
        entryMethod: 'manual', // 'manual' یا 'template' - روش ورود جزئیات
        newProxy: {}, // آبجکت برای نگهداری داده‌های پروکسی جدیدی که کاربر وارد می‌کنه
        selectedTemplate: null, // تمپلت پروکسی انتخاب شده از لیست
        
        // داده‌های مربوط به تب "پروکسی‌های من"
        savedProxies: [], // لیست پروکسی‌های ذخیره شده کاربر
        
        // داده‌های مربوط به تب "ساخت کانفیگ MiHoMo"
        selectedMihomoProxyIds: [], // ID پروکسی‌های انتخاب شده برای MiHoMo
        mihomoTemplates: [], // لیست نام تمپلت‌های قوانین MiHoMo (مثلاً full_rules, no_rules)
        selectedMihomoTemplateName: '',
        mihomoMainPort: 7890,
        mihomoSocksPort: 7891,
        generatedConfigContent: '',
        
        // داده‌های مربوط به پیام‌ها و بازخورد به کاربر
        message: '',
        messageType: '', // 'success' or 'error'
        copySuccess: false,
    },
    mounted() {
        // این متد وقتی کامپوننت Vue بارگذاری شد فراخوانی میشه
        this.fetchProtocols(); // بارگذاری پروتکل‌ها از ProtocolManager
        this.fetchSavedProxies(); // بارگذاری پروکسی‌های ذخیره شده از ConfigManager
        this.fetchMihomoTemplates(); // بارگذاری تمپلت‌های Mihomo از MihomoConfigGenerator
    },
    methods: {
        // --- متدهای عمومی ---
        showMessage(msg, type) {
            this.message = msg;
            this.messageType = type;
            setTimeout(() => {
                this.message = '';
                this.messageType = '';
            }, 5000); // پیام بعد از 5 ثانیه ناپدید شود
        },

        // --- متدهای مربوط به پروتکل‌ها ---
        fetchProtocols() {
            this.protocols = ProtocolManager.getAllProtocolNames();
        },
        async onProtocolChange() {
            this.currentProtocolFields = [];
            this.proxyTemplates = [];
            this.newProxy = {}; // ریست کردن فرم
            this.entryMethod = 'manual'; // پیش‌فرض به دستی
            this.selectedTemplate = null; // ریست کردن تمپلت انتخابی

            if (this.selectedProtocolName) {
                const protocolInstance = ProtocolManager.getProtocolByName(this.selectedProtocolName);
                if (protocolInstance) {
                    this.currentProtocolFields = protocolInstance.getConfigFields();
                    this.proxyTemplates = protocolInstance.getDefaultProxyTemplates();
                    
                    // مقداردهی اولیه newProxy با مقادیر پیش‌فرض فیلدها
                    this.currentProtocolFields.forEach(field => {
                        if (field.default !== undefined) {
                            this.$set(this.newProxy, field.id, field.default);
                        } else {
                            // اگر default نداشت و از نوع عدد بود، مقدار null یا خالی بده
                            this.$set(this.newProxy, field.id, field.type === 'number' ? null : '');
                        }
                    });
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
                        this.$set(updatedProxy, field.id, templateValue);
                    } else if (field.default !== undefined) {
                        this.$set(updatedProxy, field.id, field.default);
                    } else {
                        this.$set(updatedProxy, field.id, field.type === 'number' ? null : '');
                    }
                });
                this.newProxy = updatedProxy;
            }
        },

        // --- متدهای مربوط به مدیریت پروکسی‌ها ---
        addProxy() {
            // اعتبارسنجی ساده سمت فرانت‌اند
            for (const field of this.currentProtocolFields) {
                if (field.required && (this.newProxy[field.id] === null || this.newProxy[field.id] === undefined || this.newProxy[field.id] === '')) {
                    this.showMessage(`فیلد '${field.label}' اجباری است.`, 'error');
                    return;
                }
            }

            const proxyToSend = { ...this.newProxy, protocol_name: this.selectedProtocolName };
            
            if (ConfigManager.addConfig(proxyToSend)) {
                this.showMessage('پروکسی با موفقیت اضافه شد!', 'success');
                this.fetchSavedProxies(); // رفرش لیست
                this.resetAddProxyForm(); // ریست کردن فرم
            } else {
                this.showMessage('خطا در افزودن پروکسی.', 'error');
            }
        },
        resetAddProxyForm() {
            this.selectedProtocolName = '';
            this.currentProtocolFields = [];
            this.proxyTemplates = [];
            this.newProxy = {};
            this.entryMethod = 'manual';
            this.selectedTemplate = null;
        },
        fetchSavedProxies() {
            this.savedProxies = ConfigManager.getAllConfigs();
        },
        deleteProxy(id) {
            if (!confirm('آیا مطمئن هستید که می‌خواهید این پروکسی را حذف کنید؟')) {
                return;
            }
            if (ConfigManager.deleteConfig(id)) {
                this.showMessage('پروکسی با موفقیت حذف شد.', 'success');
                this.fetchSavedProxies(); // رفرش لیست
            } else {
                this.showMessage('خطا در حذف پروکسی.', 'error');
            }
        },

        // --- متدهای مربوط به تولید کانفیگ MiHoMo ---
        fetchMihomoTemplates() {
            this.mihomoTemplates = MihomoConfigGenerator.getAvailableTemplates();
            // پیش‌فرض انتخاب 'full_rules' اگر موجود بود
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

            // تبدیل IDهای پروکسی به فرمت Mihomo با استفاده از پروتکل مربوطه
            const mihomoFormattedProxies = [];
            for (const p_id of this.selectedMihomoProxyIds) {
                const proxyData = ConfigManager.getConfigById(p_id);
                if (proxyData) {
                    const protocolInstance = ProtocolManager.getProtocolByName(proxyData.protocol_name);
                    if (protocolInstance) {
                        mihomoFormattedProxies.push(protocolInstance.generateMihomoProxyConfig(proxyData));
                    } else {
                        console.warn(`پروتکل '${proxyData.protocol_name}' برای پروکسی ID ${p_id} یافت نشد. این پروکسی نادیده گرفته شد.`);
                    }
                } else {
                    console.warn(`پروکسی با ID ${p_id} یافت نشد و نادیده گرفته شد.`);
                }
            }
            
            if (!mihomoFormattedProxies.length && this.selectedMihomoProxyIds.length > 0) {
                 this.showMessage("هیچ پروکسی معتبری برای تولید کانفیگ MiHoMo یافت نشد. لطفاً پروتکل‌های صحیح را اضافه کنید.", 'error');
                 this.generatedConfigContent = '';
                 return;
            }

            const configContent = MihomoConfigGenerator.generateConfig(
                this.selectedMihomoTemplateName,
                mihomoFormattedProxies,
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
                        setTimeout(() => this.copySuccess = false, 2000); // پیام موفقیت 2 ثانیه نمایش داده شود
                    })
                    .catch(err => {
                        console.error('Could not copy text: ', err);
                        this.showMessage('خطا در کپی کردن کانفیگ.', 'error');
                    });
            }
        }
    },
    watch: {
        // مشاهده تغییرات currentTab برای بارگذاری مجدد داده‌ها
        currentTab(newTab) {
            if (newTab === 'protocols') {
                this.fetchProtocols();
            } else if (newTab === 'view-proxies') {
                this.fetchSavedProxies();
            } else if (newTab === 'generate-config') {
                this.fetchSavedProxies(); // برای انتخاب پروکسی‌ها
                this.fetchMihomoTemplates(); // برای انتخاب تمپلت‌ها
                this.generatedConfigContent = ''; // ریست محتوای تولید شده
            }
        }
    }
});
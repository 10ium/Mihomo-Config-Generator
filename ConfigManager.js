// ConfigManager.js

class ConfigManager {
    static _instance = null;
    _storage_key = "user_proxies_configs";
    _configs = [];

    constructor() {
        if (ConfigManager._instance) {
            return ConfigManager._instance;
        }
        ConfigManager._instance = this;
        this._loadConfigs();
    }

    _loadConfigs() {
        try {
            const storedConfigs = localStorage.getItem(this._storage_key);
            if (storedConfigs) {
                this._configs = JSON.parse(storedConfigs);
                console.log("کانفیگ‌ها از Local Storage با موفقیت بارگذاری شدند.");
            } else {
                this._configs = [];
                console.log("هیچ کانفیگی در Local Storage یافت نشد. لیست خالی ایجاد شد.");
            }
        } catch (e) {
            console.error("خطا در بارگذاری کانفیگ‌ها از Local Storage:", e);
            this._configs = []; // اگر خطایی بود، لیست را خالی کن
        }
    }

    _saveConfigs() {
        try {
            localStorage.setItem(this._storage_key, JSON.stringify(this._configs));
            console.log("کانفیگ‌ها در Local Storage با موفقیت ذخیره شدند.");
        } catch (e) {
            console.error("خطا در ذخیره کانفیگ‌ها در Local Storage:", e);
        }
    }

    addConfig(configData) {
        // حداقل فیلدهای مورد نیاز برای یک پروکسی معتبر
        if (!configData || !configData.protocol_name || !configData.server || !configData.port) {
            console.error("خطا: داده کانفیگ نامعتبر است یا اطلاعات ضروری (protocol_name, server, port) را ندارد.");
            return false;
        }
        
        // بررسی برای تکرار قبل از افزودن (بر اساس server, port, protocol_name)
        const isDuplicate = this._configs.some(existingConfig => 
            existingConfig.server === configData.server &&
            existingConfig.port === configData.port &&
            existingConfig.protocol_name === configData.protocol_name
        );

        if (isDuplicate) {
            console.warn(`پروکسی تکراری (سرور: ${configData.server}, پورت: ${configData.port}, پروتکل: ${configData.protocol_name}) نادیده گرفته شد.`);
            return false; // از افزودن تکراری جلوگیری کن
        }

        // استفاده از UUID واقعی برای ID منحصر به فرد
        // uuidv4() از کتابخانه CDN که در index.html اضافه کرده اید می آید
        configData.id = uuidv4(); 
        this._configs.push(configData);
        this._saveConfigs();
        return true;
    }

    getAllConfigs() {
        return this._configs;
    }

    getConfigById(configId) {
        return this._configs.find(config => config.id === configId) || null;
    }

    updateConfig(configId, newData) {
        const index = this._configs.findIndex(config => config.id === configId);
        if (index !== -1) {
            this._configs[index] = { ...this._configs[index], ...newData };
            this._saveConfigs();
            return true;
        }
        console.error(`خطا: کانفیگ با ID ${configId} یافت نشد.`);
        return false;
    }

    deleteConfig(configId) {
        const initialLength = this._configs.length;
        this._configs = this._configs.filter(config => config.id !== configId);
        if (this._configs.length < initialLength) {
            this._saveConfigs();
            return true;
        }
        console.error(`خطا: کانفیگ با ID ${configId} یافت نشد.`);
        return false;
    }
}

const configManagerInstance = new ConfigManager();
export default configManagerInstance;
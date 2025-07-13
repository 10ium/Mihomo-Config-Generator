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

    /**
     * یک هش منحصر به فرد برای یک پیکربندی پروکسی (بدون نام و ID) تولید می‌کند.
     * این هش برای شناسایی پروکسی‌های کاملاً یکسان استفاده می‌شود.
     * @param {Object} configData - داده‌های پروکسی.
     * @returns {string} - رشته هش.
     */
    _generateProxyHash(configData) {
        // ایجاد یک کپی از configData و حذف فیلدهای نام و ID که برای شناسایی تکراری‌ها مهم نیستند.
        const comparableConfig = { ...configData };
        delete comparableConfig.name;
        delete comparableConfig.id;

        // برای اطمینان از ترتیب ثابت کلیدها (برای هش ثابت)، آن‌ها را مرتب می‌کنیم.
        const sortedKeys = Object.keys(comparableConfig).sort();
        const orderedConfig = {};
        for (const key of sortedKeys) {
            orderedConfig[key] = comparableConfig[key];
        }

        // تبدیل شیء به رشته JSON. JSON.stringify یک هش ساده و قابل اعتماد ایجاد می‌کند.
        // اگر مقادیر آبجکت‌های تو در تو (مانند headers, ws-opts) از قبل رشته JSON باشند،
        // JSON.stringify آن‌ها را به درستی در هش شامل می‌کند.
        return JSON.stringify(orderedConfig);
    }

    /**
     * یک کانفیگ جدید را اضافه می‌کند.
     * 1. ابتدا بررسی می‌کند که آیا پروکسی کاملاً یکسان (بر اساس هش) از قبل وجود دارد یا خیر.
     * 2. سپس، نام پروکسی را برای جلوگیری از تکرار نام‌ها (با افزودن عدد افزایشی) منحصر به فرد می‌کند.
     * @param {Object} configData - داده‌های پروکسی برای اضافه کردن.
     * @returns {boolean} - true اگر با موفقیت اضافه شد، false در صورت وجود تکراری از نظر پیکربندی اصلی.
     */
    addConfig(configData) {
        // حداقل فیلدهای مورد نیاز برای یک پروکسی معتبر
        if (!configData || !configData.protocol_name || !configData.server || !configData.port) {
            console.error("خطا: داده کانفیگ نامعتبر است یا اطلاعات ضروری (protocol_name, server, port) را ندارد.");
            return false;
        }
        
        // **بررسی برای تکرار پیکربندی اصلی (با استفاده از هش)**
        const newProxyHash = this._generateProxyHash(configData);
        const isExactDuplicate = this._configs.some(existingConfig => 
            this._generateProxyHash(existingConfig) === newProxyHash
        );

        if (isExactDuplicate) {
            console.warn(`پروکسی تکراری (پیکربندی اصلی یکسان) نادیده گرفته شد.`);
            return false; // از افزودن تکراری دقیق جلوگیری کن
        }

        // **بررسی برای تکرار نام پروکسی و اضافه کردن عدد افزایشی**
        let baseName = configData.name;
        if (!baseName) { // اگر نامی تعیین نشده باشد، یک نام پیش‌فرض می‌سازیم.
            baseName = `${configData.protocol_name}-${configData.server}:${configData.port}`;
        }

        let newName = baseName;
        let counter = 1;
        // حلقه می‌زند تا نامی منحصر به فرد پیدا کند
        while (this._configs.some(existingConfig => existingConfig.name === newName)) {
            newName = `${baseName} (${counter})`;
            counter++;
        }
        configData.name = newName; // نام نهایی و منحصر به فرد را اختصاص می‌دهد

        // استفاده از UUID واقعی برای ID منحصر به فرد
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
            // اطمینان حاصل می‌کنیم که نام تغییر یافته هم بررسی شود تا تکراری نباشد
            // اگر نام تغییر کرده، باید منحصر به فرد بودن آن را بررسی کنیم
            if (newData.name && newData.name !== this._configs[index].name) {
                let tempName = newData.name;
                let counter = 1;
                let finalName = tempName;
                // بررسی می‌کنیم که آیا نام جدید با نام‌های موجود تداخل دارد (به جز خودش)
                while (this._configs.some(existingConfig => existingConfig.id !== configId && existingConfig.name === finalName)) {
                    finalName = `${tempName} (${counter})`;
                    counter++;
                }
                newData.name = finalName;
            }

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

// ConfigManager.js

class ConfigManager {
    static _instance = null; // برای پیاده‌سازی Singleton Pattern
    _storage_key = "user_proxies_configs"; // کلیدی که برای ذخیره در Local Storage استفاده می‌شود
    _configs = []; // لیست کانفیگ‌های بارگذاری شده

    constructor() {
        if (ConfigManager._instance) {
            return ConfigManager._instance; // اگر نمونه‌ای وجود دارد، همان را برگردان
        }
        ConfigManager._instance = this; // در غیر این صورت، این نمونه را ذخیره کن
        this._loadConfigs(); // بارگذاری کانفیگ‌ها در اولین ایجاد نمونه
    }

    _loadConfigs() {
        /**
         * کانفیگ‌ها را از Local Storage مرورگر بارگذاری می‌کند.
         */
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
        /**
         * کانفیگ‌های فعلی را در Local Storage مرورگر ذخیره می‌کند.
         */
        try {
            localStorage.setItem(this._storage_key, JSON.stringify(this._configs));
            console.log("کانفیگ‌ها در Local Storage با موفقیت ذخیره شدند.");
        } catch (e) {
            console.error("خطا در ذخیره کانفیگ‌ها در Local Storage:", e);
        }
    }

    addConfig(configData) {
        /**
         * یک کانفیگ جدید به لیست اضافه می‌کند و آن را ذخیره می‌کند.
         * `configData` باید شامل 'protocol_name' و سایر جزئیات پروکسی باشد.
         * @param {Object} configData - داده‌های کانفیگ پروکسی جدید.
         * @returns {boolean} - true اگر با موفقیت اضافه شد، false در غیر این صورت.
         */
        if (!configData || !configData.protocol_name) {
            console.error("خطا: داده کانفیگ نامعتبر است یا 'protocol_name' را ندارد.");
            return false;
        }
        
        // یک شناسه منحصر به فرد (Unique ID) برای هر کانفیگ اضافه کنید
        // بهتر است از یک UUID واقعی استفاده شود، اما فعلاً از یک timestamp ساده استفاده می‌کنیم.
        configData.id = Date.now(); // یک ID بر اساس timestamp
        this._configs.push(configData);
        this._saveConfigs();
        return true;
    }

    getAllConfigs() {
        /**
         * لیستی از تمام کانفیگ‌های پروکسی ذخیره شده را برمی‌گرداند.
         * @returns {Array<Object>}
         */
        return this._configs;
    }

    getConfigById(configId) {
        /**
         * یک کانفیگ را بر اساس ID آن برمی‌گرداند.
         * @param {number} configId - ID کانفیگ مورد نظر.
         * @returns {Object | null} - شیء کانفیگ یا null اگر یافت نشد.
         */
        return this._configs.find(config => config.id === configId) || null;
    }

    updateConfig(configId, newData) {
        /**
         * یک کانفیگ موجود را بر اساس ID آن به‌روزرسانی می‌کند.
         * @param {number} configId - ID کانفیگ مورد نظر برای به‌روزرسانی.
         * @param {Object} newData - داده‌های جدید برای به‌روزرسانی کانفیگ.
         * @returns {boolean} - true اگر با موفقیت به‌روزرسانی شد، false در غیر این صورت.
         */
        const index = this._configs.findIndex(config => config.id === configId);
        if (index !== -1) {
            this._configs[index] = { ...this._configs[index], ...newData }; // ادغام داده‌های جدید
            this._saveConfigs();
            return true;
        }
        console.error(`خطا: کانفیگ با ID ${configId} یافت نشد.`);
        return false;
    }

    deleteConfig(configId) {
        /**
         * یک کانفیگ را بر اساس ID آن حذف می‌کند.
         * @param {number} configId - ID کانفیگ مورد نظر برای حذف.
         * @returns {boolean} - true اگر با موفقیت حذف شد، false در غیر این صورت.
         */
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

// برای اینکه بتوانیم فقط یک نمونه از ConfigManager داشته باشیم (Singleton)
const configManagerInstance = new ConfigManager();
export default configManagerInstance;
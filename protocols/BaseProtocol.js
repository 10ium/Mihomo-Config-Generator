// protocols/BaseProtocol.js

class BaseProtocol {
    constructor() {
        if (new.target === BaseProtocol) {
            throw new Error("BaseProtocol یک کلاس انتزاعی است و نمی‌توان از آن به صورت مستقیم نمونه‌سازی کرد.");
        }
    }

    /**
     * نام پروتکل را برمی‌گرداند (مثلاً "SOCKS5", "HTTP").
     * @returns {string}
     */
    getName() {
        throw new Error("متد 'getName()' باید پیاده‌سازی شود.");
    }

    /**
     * ساختار فیلدهای مورد نیاز برای ورود دستی جزئیات کانفیگ این پروتکل را برمی‌گرداند.
     * @returns {Array<Object>} هر شیء شامل:
     * - 'id': (string) شناسه منحصر به فرد فیلد (مثلاً 'server_address')
     * - 'label': (string) نام قابل نمایش برای کاربر (مثلاً 'آدرس سرور')
     * - 'type': (string) نوع ورودی (مثلاً 'text', 'number', 'password', 'boolean')
     * - 'default': (any, اختیاری) مقدار پیش‌فرض
     * - 'required': (boolean, اختیاری) آیا این فیلد الزامی است یا خیر
     * - 'placeholder': (string, اختیاری) متن راهنما
     */
    getConfigFields() {
        throw new Error("متد 'getConfigFields()' باید پیاده‌سازی شود.");
    }

    /**
     * لیستی از تمپلت‌های پروکسی پیش‌فرض برای این پروتکل را برمی‌گرداند.
     * @returns {Array<Object>} هر تمپلت شامل:
     * - 'name': (string) نام تمپلت (مثلاً 'SOCKS5 Standard')
     * - 'description': (string) توضیحات کوتاه
     * - 'values': (Object) دیکشنری‌ای از مقادیر پیش‌فرض برای فیلدها (با 'id' به عنوان کلید)
     */
    getDefaultProxyTemplates() {
        throw new Error("متد 'getDefaultProxyTemplates()' باید پیاده‌سازی شود.");
    }

    /**
     * کانفیگ بخش 'proxies' مربوط به Mihomo را بر اساس تنظیمات وارد شده توسط کاربر
     * برای این پروتکل تولید می‌کند.
     * @param {Object} userConfig شامل مقادیری است که کاربر در UI وارد کرده (کلیدها همان 'id' فیلدها هستند).
     * @returns {Object} یک شیء JavaScript که ساختار کانفیگ Mihomo را دارد.
     */
    generateMihomoProxyConfig(userConfig) {
        throw new Error("متد 'generateMihomoProxyConfig()' باید پیاده‌سازی شود.");
    }
}

export default BaseProtocol;
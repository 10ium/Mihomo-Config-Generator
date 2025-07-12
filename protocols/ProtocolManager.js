// protocols/ProtocolManager.js

// وارد کردن کلاس‌های پروتکل
import HTTPProxy from './HTTPProxy.js';
import SOCKS5Proxy from './SOCKS5Proxy.js';

class ProtocolManager {
    static _instance = null; // برای پیاده‌سازی Singleton Pattern
    _protocols = {}; // دیکشنری برای نگهداری نمونه‌های پروتکل

    constructor() {
        if (ProtocolManager._instance) {
            return ProtocolManager._instance; // اگر نمونه‌ای وجود دارد، همان را برگردان
        }
        ProtocolManager._instance = this; // در غیر این صورت، این نمونه را ذخیره کن
        this._loadProtocols(); // بارگذاری پروتکل‌ها در اولین ایجاد نمونه
    }

    _loadProtocols() {
        /**
         * پروتکل‌های پیاده‌سازی شده را به صورت دستی در اینجا ثبت می‌کنیم.
         * در جاوااسکریپت مرورگر، امکان اسکن دینامیک فایل‌ها مثل پایتون وجود ندارد،
         * بنابراین پروتکل‌های جدید باید اینجا اضافه شوند.
         */
        const protocolClasses = [
            HTTPProxy,
            SOCKS5Proxy
            // پروتکل‌های جدید را در آینده اینجا اضافه کنید (مثلاً VmessProxy, ShadowsocksProxy)
        ];

        for (const ProtocolClass of protocolClasses) {
            try {
                const protocolInstance = new ProtocolClass();
                this._protocols[protocolInstance.getName()] = protocolInstance;
                console.log(`پروتکل '${protocolInstance.getName()}' با موفقیت بارگذاری شد.`);
            } catch (e) {
                console.error(`خطا در بارگذاری پروتکل: ${ProtocolClass.name}`, e);
            }
        }
    }

    /**
     * لیستی از تمام نمونه‌های پروتکل بارگذاری شده را برمی‌گرداند.
     * @returns {Array<BaseProtocol>}
     */
    getAllProtocols() {
        return Object.values(this._protocols);
    }

    /**
     * یک نمونه پروتکل را بر اساس نام آن برمی‌گرداند.
     * @param {string} name - نام پروتکل (مثلاً "HTTP")
     * @returns {BaseProtocol | null}
     */
    getProtocolByName(name) {
        return this._protocols[name] || null;
    }

    /**
     * لیستی از نام تمام پروتکل‌های بارگذاری شده را برمی‌گرداند.
     * @returns {Array<string>}
     */
    getAllProtocolNames() {
        return Object.keys(this._protocols);
    }
}

// برای اینکه بتوانیم فقط یک نمونه از ProtocolManager داشته باشیم (Singleton)
const protocolManagerInstance = new ProtocolManager();
export default protocolManagerInstance;
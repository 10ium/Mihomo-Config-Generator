// protocols/LinkParser.js

/**
 * کلاس LinkParser مسئول تجزیه لینک‌های اشتراک پروکسی از پروتکل‌های مختلف است.
 * این کلاس متدهای استاتیک برای تجزیه فرمت‌های خاص لینک‌ها را ارائه می‌دهد
 * و یک شیء استاندارد شده از پیکربندی پروکسی را برمی‌گرداند.
 */
class LinkParser {

    /**
     * لینک SOCKS5 را تجزیه می‌کند.
     * فرمت مورد انتظار: socks5://[username:password@]server:port[?params][#name]
     * @param {string} link - لینک SOCKS5.
     * @returns {Object|null} - شیء پروکسی تجزیه شده یا null در صورت خطا.
     */
    static parseSocks5Link(link) {
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
            // پارامترهای URL همیشه رشته هستند، نیاز به تبدیل نوع دارند
            if (params.has('tls')) proxy.tls = params.get('tls').toLowerCase() === 'true';
            if (params.has('skip-cert-verify')) proxy['skip-cert-verify'] = params.get('skip-cert-verify').toLowerCase() === 'true';
            if (params.has('udp')) proxy.udp = params.get('udp').toLowerCase() === 'true';
            if (params.has('ip-version')) proxy['ip-version'] = params.get('ip-version');
            if (params.has('fingerprint')) proxy.fingerprint = params.get('fingerprint');

            // نام پروکسی از بخش hash (#) استخراج می‌شود، در غیر این صورت یک نام پیش‌فرض ساخته می‌شود.
            proxy.name = url.hash ? decodeURIComponent(url.hash.substring(1)) : `SOCKS5-${proxy.server}:${proxy.port}`;
            return proxy;
        } catch (e) {
            console.error("خطا در تجزیه لینک SOCKS5:", link, e);
            return null;
        }
    }

    /**
     * لینک HTTP/HTTPS را تجزیه می‌کند.
     * فرمت مورد انتظار: http(s)://[username:password@]server:port[?params][#name]
     * @param {string} link - لینک HTTP/HTTPS.
     * @returns {Object|null} - شیء پروکسی تجزیه شده یا null در صورت خطا.
     */
    static parseHttpLink(link) {
        try {
            const url = new URL(link);
            const proxy = {
                type: "http",
                server: url.hostname,
                port: parseInt(url.port)
            };
            if (url.username) proxy.username = decodeURIComponent(url.username);
            if (url.password) proxy.password = decodeURIComponent(url.password);

            // تشخیص TLS بر اساس پروتکل (http:// یا https://)
            proxy.tls = url.protocol === 'https:';

            const params = new URLSearchParams(url.search);
            if (params.has('skip-cert-verify')) proxy['skip-cert-verify'] = params.get('skip-cert-verify').toLowerCase() === 'true';
            if (params.has('sni')) proxy.sni = params.get('sni');
            if (params.has('fingerprint')) proxy.fingerprint = params.get('fingerprint');
            if (params.has('ip-version')) proxy['ip-version'] = params.get('ip-version');
            if (params.has('headers')) {
                try {
                    // هدرها به صورت رشته JSON در URL هستند، باید تجزیه شوند.
                    proxy.headers = JSON.parse(decodeURIComponent(params.get('headers')));
                } catch (e) {
                    console.warn("هدرهای JSON در لینک HTTP نامعتبر است:", params.get('headers'));
                }
            }
            // نام پروکسی از بخش hash (#) استخراج می‌شود، در غیر این صورت یک نام پیش‌فرض ساخته می‌شود.
            proxy.name = url.hash ? decodeURIComponent(url.hash.substring(1)) : `HTTP-${proxy.server}:${proxy.port}`;
            return proxy;
        } catch (e) {
            console.error("خطا در تجزیه لینک HTTP:", link, e);
            return null;
        }
    }

    /**
     * لینک VLESS را تجزیه می‌کند.
     * فرمت مورد انتظار: vless://uuid@server:port[?params][#name]
     * این متد پارامترهای URL را به صورت دستی تجزیه می‌کند تا در برابر فرمت‌های پیچیده مقاوم‌تر باشد.
     * @param {string} link - لینک VLESS.
     * @returns {Object|null} - شیء پروکسی تجزیه شده یا null در صورت خطا.
     */
    static parseVlessLink(link) {
        try {
            // جدا کردن نام (fragment) از بقیه لینک
            const linkParts = link.substring(8).split('#'); // حذف "vless://" و جدا کردن با #
            const rawLink = linkParts[0];
            // نام پروکسی از بخش hash (#) استخراج می‌شود، در غیر این صورت یک نام پیش‌فرض ساخته می‌شود.
            const name = linkParts.length > 1 ? decodeURIComponent(linkParts[1]) : `VLESS-Proxy`;

            // جدا کردن UUID از سرور:پورت و پارامترها
            const atParts = rawLink.split('@');
            if (atParts.length < 2) {
                console.warn("فرمت لینک VLESS نامعتبر است (فاقد @):", link);
                return null;
            }

            const uuid = atParts[0];
            const serverAndPortParams = atParts[1].split('?');
            const serverPortPart = serverAndPortParams[0];
            
            const [server, portStr] = serverPortPart.split(':');
            const port = parseInt(portStr);

            if (!server || isNaN(port)) {
                console.warn("سرور یا پورت VLESS نامعتبر است:", link);
                return null;
            }

            const proxy = {
                type: "vless",
                name: name, // استفاده از نام استخراج شده
                server: server,
                port: port,
                uuid: uuid,
                udp: true, // پیش‌فرض برای VLESS، می‌تواند توسط پارامترها بازنویسی شود
                tls: false, // پیش‌فرض false، در صورت security=tls یا reality به true تنظیم می‌شود
                network: "tcp" // پیش‌فرض network، می‌تواند توسط پارامتر 'type' بازنویسی شود
            };

            // تجزیه دستی Query String برای مقاومت بیشتر در برابر مسیرهای بدشکل
            let paramsMap = new Map();
            if (serverAndPortParams.length > 1) {
                const queryString = serverAndPortParams[1];
                // اصلاح: از regex برای تقسیم رشته کوئری استفاده می‌کنیم تا pathهای حاوی '?' را بهتر مدیریت کنیم.
                // این regex یک جفت key=value یا فقط key را پیدا می‌کند.
                const paramPairs = queryString.match(/[^&;=]+=?[^&;]*/g) || [];
                paramPairs.forEach(pair => {
                    const eqIndex = pair.indexOf('=');
                    if (eqIndex > -1) {
                        const key = decodeURIComponent(pair.substring(0, eqIndex));
                        const value = decodeURIComponent(pair.substring(eqIndex + 1));
                        paramsMap.set(key, value);
                    } else if (pair) {
                        paramsMap.set(decodeURIComponent(pair), ''); // Handle flag parameters
                    }
                });
            }

            // مدیریت نوع network/transport
            let networkType = paramsMap.get('type');
            if (networkType) {
                if (networkType === 'ws' || networkType === 'xhttp') { // xhttp نیز به ws نگاشت می‌شود
                    proxy.network = 'ws';
                    const wsOpts = {};
                    if (paramsMap.has('path')) wsOpts.path = paramsMap.get('path');
                    if (paramsMap.has('host')) {
                        if (!wsOpts.headers) wsOpts.headers = {};
                        wsOpts.headers.Host = paramsMap.get('host');
                    }
                    if (Object.keys(wsOpts).length > 0) {
                        proxy['ws-opts'] = wsOpts; 
                    }
                } else if (['grpc', 'h2', 'http', 'tcp'].includes(networkType)) {
                    proxy.network = networkType;
                    // MiHoMo برای VLESS با network: tcp نیازی به flow خاصی ندارد مگر اینکه explicitly xtls-rprx-vision باشد
                    // اما برای network: grpc نیاز به grpc-opts دارد.
                    if (networkType === 'grpc' && paramsMap.has('serviceName')) {
                        proxy['grpc-opts'] = { 'grpc-service-name': paramsMap.get('serviceName') };
                    }
                }
            }

            // مدیریت TLS/Reality
            if (paramsMap.has('security')) {
                const securityType = paramsMap.get('security');
                if (securityType === 'tls' || securityType === 'reality') {
                    proxy.tls = true;
                    if (paramsMap.has('sni')) proxy.servername = paramsMap.get('sni');
                    // 'fp' در لینک‌های VLESS معمولاً به client-fingerprint اشاره دارد
                    if (paramsMap.has('fp')) proxy['client-fingerprint'] = paramsMap.get('fp'); 
                    // 'fingerprint' برای اثر انگشت گواهی سرور است، اگر به صراحت در لینک ارائه شود
                    if (paramsMap.has('fingerprint')) proxy.fingerprint = paramsMap.get('fingerprint'); 
                    
                    if (paramsMap.has('alpn')) {
                        try {
                            // ALPN در URL با کاما جدا می‌شود، به آرایه تبدیل می‌شود.
                            proxy.alpn = paramsMap.get('alpn').split(','); 
                        } catch (e) {
                            console.warn(`فرمت ALPN در لینک VLESS نامعتبر است: ${paramsMap.get('alpn')}`);
                        }
                    }
                    // بررسی 'allowInsecure' یا 'skip-cert-verify'
                    if ((paramsMap.has('allowInsecure') && paramsMap.get('allowInsecure').toLowerCase() === 'true') ||
                        (paramsMap.has('skip-cert-verify') && paramsMap.get('skip-cert-verify').toLowerCase() === 'true')) {
                        proxy['skip-cert-verify'] = true;
                    }

                    if (securityType === 'reality') {
                        const realityOpts = {};
                        if (paramsMap.has('pbk')) realityOpts['public-key'] = paramsMap.get('pbk');
                        if (paramsMap.has('sid')) realityOpts['short-id'] = paramsMap.get('sid');
                        if (Object.keys(realityOpts).length > 0) {
                            proxy['reality-opts'] = realityOpts; 
                        }
                        // Reality implicitly sets client-fingerprint to chrome if not specified
                        if (!proxy['client-fingerprint']) {
                            proxy['client-fingerprint'] = 'chrome';
                        }
                    }
                }
            }
            
            // سایر پارامترها - اطمینان از نگاشت صحیح به فیلدهای MiHoMo
            if (paramsMap.has('flow')) proxy.flow = paramsMap.get('flow');
            if (paramsMap.has('packet-encoding')) proxy['packet-encoding'] = paramsMap.get('packet-encoding');
            if (paramsMap.has('ip-version')) proxy['ip-version'] = paramsMap.get('ip-version');
            // smux در MiHoMo یک شیء با enabled: true/false است، نه فقط یک boolean
            if (paramsMap.has('smux')) {
                proxy.smux = paramsMap.get('smux').toLowerCase() === 'true'; // Keep as boolean here
            } else {
                proxy.smux = false; // Explicitly set to false if not in link
            }


            return proxy;

        } catch (e) {
            console.error("خطا در تجزیه لینک VLESS:", link, e);
            return null;
        }
    }

    /**
     * یک لینک اشتراک پروکسی را بر اساس پیشوند آن تجزیه می‌کند.
     * @param {string} link - لینک اشتراک پروکسی.
     * @returns {Object|null} - شیء پروکسی تجزیه شده یا null اگر پروتکل پشتیبانی نشود.
     */
    static parse(link) {
        if (link.startsWith("socks5://")) {
            return LinkParser.parseSocks5Link(link);
        } else if (link.startsWith("http://") || link.startsWith("https://")) {
            return LinkParser.parseHttpLink(link);
        } else if (link.startsWith("vless://")) {
            return LinkParser.parseVlessLink(link);
        }
        // TODO: اینجا می‌توانید پروتکل‌های Vmess, SS, Trojan, ... را هم اضافه کنید
        // با فراخوانی متدهای parseVmessLink, parseSsLink و غیره.
        return null; // پروتکل ناشناخته
    }
}

export default LinkParser;

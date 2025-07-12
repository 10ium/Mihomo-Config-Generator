// MihomoConfigGenerator.js

// چون نمی‌تونیم فایل‌های YAML رو مستقیماً از فایل‌سیستم مرورگر بخونیم،
// محتوای تمپلت‌ها رو اینجا به صورت رشته (String) نگه می‌داریم.
// در یک پروژه بزرگتر، اینها می‌توانستند از طریق یک درخواست fetch از یک سرور استاتیک لود شوند،
// اما برای سادگی و آفلاین بودن، آنها را اینجا قرار می‌دهیم.

// تمپلت قوانین کامل (full_rules.yaml)
const FULL_RULES_TEMPLATE_CONTENT = `
# این یک تمپلت پیش‌فرض برای کانفیگ MiHoMo است.
# بخش‌های proxies, proxy-groups, rule-providers و rules
# توسط برنامه تولید می‌شوند.
# نیازی به تغییر دستی این فایل نیست.

global-client-fingerprint: chrome
port: {{mihomo_port}}
socks-port: {{mihomo_socks_port}}
redir-port: 7892
mixed-port: 7893
tproxy-port: 7894
allow-lan: true
tcp-concurrent: true
enable-process: true
find-process-mode: always
ipv6: true
log-level: debug
geo-auto-update: true
geo-update-interval: 168 # 168 hours = 7 days
secret: ''
bind-address: '*'
unified-delay: false
disable-keep-alive: false
keep-alive-idle: 30
keep-alive-interval: 30
profile:
  store-selected: true
  store-fake-ip: true

dns:
  enable: true
  ipv6: true
  respect-rules: false
  prefer-h3: true
  cache-algorithm: arc
  use-system-hosts: true
  use-host: true
  listen: 0.0.0.0:53
  enhanced-mode: fake-ip
  fake-ip-filter-mode: blacklist
  fake-ip-range: 198.18.0.1/16
  fake-ip-filter:
    - '*.lan'
    - '*.localdomain'
    - '*.invalid'
    - '*.localhost'
    - '*.test'
    - '*.local'
    - '*.home.arpa'
    - 'time.*.com'
    - 'ntp.*.com'
    - '*.ir'

  default-nameserver:
    - 8.8.8.8
    - 8.8.4.4
    - 1.0.0.1
    - 1.1.1.1
    - 9.9.9.9
    - 9.9.9.11
    - 9.9.9.10
    - 94.140.14.15
    - 94.140.15.15
    - 223.5.5.5
    - 77.88.8.8
  nameserver:
    - 'https://dns.nextdns.io/15441b'
    - 'tls://15441b.dns.nextdns.io'
    - '2a07:a8c0::15:441b'
    - '2a07:a8c1::15:441b'
  direct-nameserver:
    - '78.157.42.100'
    - '78.157.42.101'
  proxy-server-nameserver:
    - '2606:4700:4700::1111'
    - '2606:4700:4700::1001'
    - '2001:4860:4860::8888'
    - '2001:4860:4860::8844'
    - '1.1.1.1'
    - '8.8.8.8'
    - '8.8.4.4'
    - '9.9.9.9'
    - '223.5.5.5'
    - '77.88.8.8'
    - '2400:3200::1'
    - '2a02:6b8::feed:0ff'
    - '2620:fe::fe'

sniffer:
  enable: true
  force-dns-mapping: true
  parse-pure-ip: true
  override-destination: false
  sniff:
    HTTP:
      ports: [80, 8080, 8880, 2052, 2082, 2086, 2095]
    TLS:
      ports: [443, 8443, 2053, 2083, 2087, 2096]

tun:
  enable: true
  stack: mixed
  auto-route: true
  auto-detect-interface: true
  auto-redir: true
  dns-hijack:
    - "any:53"
    - "tcp://any:53"

ntp:
  enable: true
  server: "time.apple.com"
  port: 123
  interval: 30

rule-providers:
  category_public_tracker:
    type: http
    behavior: domain
    url: https://raw.githubusercontent.com/10ium/V2rayDomains2Clash/generated/category-public-tracker.yaml
    interval: 86400
    path: ./ruleset/category_public_tracker.yaml
  iran_ads:
    type: http
    behavior: domain
    url: https://github.com/bootmortis/iran-hosted-domains/releases/latest/download/clash_rules_ads.yaml
    interval: 86400
    path: ./ruleset/iran_ads.yaml
  PersianBlocker:
    type: http
    behavior: domain
    url: https://github.com/MasterKia/iran-hosted-domains/releases/latest/download/clash_rules_ads.yaml
    interval: 86400
    path: ./ruleset/PersianBlocker.yaml
  youtube:
    type: http
    behavior: domain
    url: https://raw.githubusercontent.com/10ium/V2rayDomains2Clash/generated/youtube.yaml
    interval: 86400
    path: ./ruleset/youtube.yaml
  telegram:
    type: http
    behavior: domain
    url: https://raw.githubusercontent.com/10ium/V2rayDomains2Clash/generated/telegram.yaml
    interval: 86400
    path: ./ruleset/telegram.yaml
  twitch:
    type: http
    behavior: domain
    url: https://raw.githubusercontent.com/10ium/V2rayDomains2Clash/generated/twitch.yaml
    interval: 86400
    path: ./ruleset/twitch.yaml
  censor:
    type: http
    behavior: classical
    url: https://raw.githubusercontent.com/10ium/clash_rules/main/censor.yaml
    interval: 86400
    path: ./ruleset/censor.yaml
  local_ips:
    type: http
    behavior: ipcidr
    url: https://raw.githubusercontent.com/10ium/V2rayDomains2Clash/generated/local-ips.yaml
    interval: 86400
    path: ./ruleset/local_ips.yaml
  private:
    type: http
    behavior: domain
    url: https://raw.githubusercontent.com/10ium/V2rayDomains2Clash/generated/private.yaml
    interval: 86400
    path: ./ruleset/private.yaml
  category_ir:
    type: http
    behavior: domain
    url: https://raw.githubusercontent.com/10ium/V2rayDomains2Clash/generated/category-ir.yaml
    interval: 86400
    path: ./ruleset/category_ir.yaml
  iran:
    type: http
    behavior: classical
    url: https://raw.githubusercontent.com/10ium/clash_rules/main/iran.yaml
    interval: 86400
    path: ./ruleset/iran.yaml
  steam:
    type: http
    behavior: classical
    url: https://raw.githubusercontent.com/10ium/clash_rules/main/steam.yaml
    interval: 86400
    path: ./ruleset/steam.yaml
  game:
    type: http
    behavior: classical
    url: https://raw.githubusercontent.com/10ium/clash_rules/refs/heads/main/game.yaml
    interval: 86400
    path: ./ruleset/game.yaml
  category-games:
    type: http
    behavior: domain
    url: https://raw.githubusercontent.com/10ium/V2rayDomains2Clash/refs/heads/generated/category-games.yaml
    interval: 86400
    path: ./ruleset/category-games.yaml
  ir:
    type: http
    behavior: domain
    url: https://github.com/chocolate4u/Iran-clash-rules/releases/latest/download/ir.yaml
    interval: 86400
    path: ./ruleset/ir.yaml
  apps:
    type: http
    behavior: classical
    url: https://github.com/chocolate4u/Iran-clash-rules/releases/latest/download/apps.yaml
    interval: 86400
    path: ./ruleset/apps.yaml
  ircidr:
    type: http
    behavior: ipcidr
    url: https://github.com/chocolate4u/Iran-clash-rules/releases/latest/download/ircidr.yaml
    interval: 86400
    path: ./ruleset/ircidr.yaml
  irasn:
    type: http
    behavior: classical
    url: https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/irasn.yaml
    interval: 86400
    path: ./ruleset/irasn.yaml
  arvancloud:
    type: http
    behavior: ipcidr
    url: https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/arvancloud.yaml
    interval: 86400
    path: ./ruleset/arvancloud.yaml
  derakcloud:
    type: http
    behavior: ipcidr
    url: https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/derakcloud.yaml
    interval: 86400
    path: ./ruleset/derakcloud.yaml
  iranserver:
    type: http
    behavior: ipcidr
    url: https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/iranserver.yaml
    interval: 86400
    path: ./ruleset/iranserver.yaml
  parspack:
    type: http
    behavior: ipcidr
    url: https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/parspack.yaml
    interval: 86400
    path: ./ruleset/parspack.yaml
  malware:
    type: http
    behavior: domain
    url: https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/malware.yaml
    interval: 86400
    path: ./ruleset/malware.yaml
  phishing:
    type: http
    behavior: domain
    url: https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/phishing.yaml
    interval: 86400
    path: ./ruleset/phishing.yaml
  cryptominers:
    type: http
    behavior: domain
    url: https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/cryptominers.yaml
    interval: 86400
    path: ./ruleset/cryptominers.yaml
  ads:
    type: http
    behavior: domain
    url: https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/releases/latest/download/category-ads-all.yaml
    interval: 86400
    path: ./ruleset/ads.yaml
  DownloadManagers:
    type: http
    behavior: classical
    url: https://raw.githubusercontent.com/10ium/clash_rules/refs/heads/main/DownloadManagers.yaml
    interval: 86400
    path: ./ruleset/DownloadManagers.yaml
  BanProgramAD:
    type: http
    behavior: classical
    url: https://raw.githubusercontent.com/10ium/mihomo_rule/refs/heads/main/list/BanProgramAD.yaml
    interval: 86400
    path: ./ruleset/BanProgramAD.yaml
  BanAD:
    type: http
    behavior: classical
    url: https://raw.githubusercontent.com/10ium/mihomo_rule/refs/heads/main/list/BanAD.yaml
    interval: 86400
    path: ./ruleset/BanAD.yaml
  PrivateTracker:
    type: http
    behavior: classical
    url: https://raw.githubusercontent.com/10ium/mihomo_rule/refs/heads/main/list/PrivateTracker.yaml
    interval: 86400
    path: ./ruleset/PrivateTracker.yaml
  BanEasyList:
    type: http
    behavior: classical
    url: https://raw.githubusercontent.com/10ium/mihomo_rule/refs/heads/main/list/BanEasyList.yaml
    interval: 86400
    path: ./ruleset/BanEasyList.yaml
  Download:
    type: http
    behavior: classical
    url: https://raw.githubusercontent.com/10ium/mihomo_rule/refs/heads/main/list/Download.yaml
    interval: 86400
    path: ./ruleset/Download.yaml
  GameDownload:
    type: http
    behavior: classical
    url: https://raw.githubusercontent.com/10ium/mihomo_rule/refs/heads/main/list/GameDownload.yaml
    interval: 86400
    path: ./ruleset/GameDownload.yaml
  SteamRegionCheck:
    type: http
    behavior: classical
    url: https://raw.githubusercontent.com/10ium/mihomo_rule/refs/heads/main/list/SteamRegionCheck.yaml
    interval: 86400
    path: ./ruleset/SteamRegionCheck.yaml
  Xbox:
    type: http
    behavior: classical
    url: https://raw.githubusercontent.com/10ium/mihomo_rule/refs/heads/main/list/Xbox.yaml
    interval: 86400
    path: ./ruleset/Xbox.yaml
  YouTubeMusic:
    type: http
    behavior: classical
    url: https://raw.githubusercontent.com/10ium/mihomo_rule/refs/heads/main/list/YouTubeMusic.yaml
    interval: 86400
    path: ./ruleset/YouTubeMusic.yaml
  YouTube:
    type: http
    behavior: classical
    url: https://raw.githubusercontent.com/10ium/mihomo_rule/refs/heads/main/list/YouTube.yaml
    interval: 86400
    path: ./ruleset/YouTube.yaml
  Ponzi:
    type: http
    behavior: classical
    url: https://raw.githubusercontent.com/10ium/mihomo_rule/refs/heads/main/Ponzi.yaml
    interval: 86400
    path: ./ruleset/Ponzi.yaml
  warninglist:
    type: http
    behavior: classical
    url: https://raw.githubusercontent.com/10ium/mihomo_rule/refs/heads/main/list/warning-list.yaml
    interval: 86400
    path: ./ruleset/warninglist.yaml
  google:
    type: http
    behavior: domain
    url: https://raw.githubusercontent.com/10ium/V2rayDomains2Clash/refs/heads/generated/google.yaml
    interval: 86400
    path: ./ruleset/google.yaml
  google-play:
    type: http
    behavior: domain
    url: https://raw.githubusercontent.com/10ium/V2rayDomains2Clash/refs/heads/generated/google-play.yaml
    interval: 86400
    path: ./ruleset/google-play.yaml
  xiaomi-ads:
    type: http
    behavior: domain
    url: https://raw.githubusercontent.com/10ium/V2rayDomains2Clash/refs/heads/generated/xiaomi-ads.yaml
    interval: 86400
    path: ./ruleset/xiaomi-ads.yaml
  xiaomi_block_list:
    type: http
    behavior: domain
    url: https://raw.githubusercontent.com/10ium/clash_rules/refs/heads/main/xiaomi_block_list.yaml
    interval: 86400
    path: ./ruleset/xiaomi_block_list.yaml
  xiaomi_white_list:
    type: http
    behavior: classical
    url: https://raw.githubusercontent.com/10ium/clash_rules/refs/heads/main/xiaomi_white_list.yaml
    interval: 86400
    path: ./ruleset/xiaomi_white_list.yaml
  cloudflare:
    type: http
    behavior: domain
    url: https://raw.githubusercontent.com/10ium/V2rayDomains2Clash/refs/heads/generated/cloudflare.yaml
    interval: 86400
    path: ./ruleset/cloudflare.yaml
  github:
    type: http
    behavior: domain
    url: https://raw.githubusercontent.com/10ium/V2rayDomains2Clash/refs/heads/generated/github.yaml
    interval: 86400
    path: ./ruleset/github.yaml
  whatsapp:
    type: http
    behavior: domain
    url: https://raw.githubusercontent.com/10ium/V2rayDomains2Clash/generated/whatsapp.yaml
    interval: 86400
    path: ./ruleset/whatsapp.yaml
  LiteAds:
    type: http
    behavior: classical
    url: https://raw.githubusercontent.com/10ium/clash_rules/refs/heads/main/LiteAds.yaml
    interval: 86400
    path: ./ruleset/LiteAds.yaml
  discord:
    type: http
    behavior: classical
    url: https://raw.githubusercontent.com/10ium/clash_rules/refs/heads/main/discord.yaml
    interval: 86400
    path: ./ruleset/discord.yaml
  instagram:
    type: http
    behavior: domain
    url: https://raw.githubusercontent.com/10ium/V2rayDomains2Clash/refs/heads/generated/instagram.yaml
    interval: 86400
    path: ./ruleset/instagram.yaml
  category-ai:
    type: http
    behavior: domain
    url: https://raw.githubusercontent.com/10ium/V2rayDomains2Clash/refs/heads/generated/category-ai-!cn.yaml
    interval: 86400
    path: ./ruleset/category-ai.yaml
  stremio:
    type: http
    behavior: classical
    url: https://raw.githubusercontent.com/10ium/clash_rules/refs/heads/main/stremio.yaml
    interval: 86400
    path: ./ruleset/stremio.yaml
  windows:
    type: http
    behavior: classical
    url: https://raw.githubusercontent.com/10ium/clash_rules/refs/heads/main/windows.yaml
    interval: 86400
    path: ./ruleset/windows.yaml

proxies:
  # این بخش با لیست پروکسی‌های کاربر پر می‌شود: {{user_proxies}}

proxy-groups:
  # نام گروه اصلی پروکسی‌ها که شامل تمام پروکسی‌های کاربر خواهد بود
  - name: "All User Proxies"
    type: select
    proxies:
      - {{user_proxy_names}} # نام پروکسی‌های وارد شده توسط کاربر

  # بقیه گروه های پروکسی از تمپلت
  - name: "نوع انتخاب پروکسی 🔀"
    type: select
    icon: https://www.svgrepo.com/show/412721/choose.svg
    proxies:
      - "خودکار (بهترین پینگ) 🤖"
      - "پشتیبان (در صورت قطعی) 🧯"
      - "دستی 🤏🏻"
      - "قطع اینترنت ⛔"
      - "بدون فیلترشکن 🛡️"

  - name: "دستی 🤏🏻"
    type: select
    icon: https://www.svgrepo.com/show/372331/cursor-hand-click.svg
    proxies:
      - {{user_proxy_names}} # اینجا هم نام پروکسی‌های کاربر
      - DIRECT

  - name: "خودکار (بهترین پینگ) 🤖"
    type: url-test
    icon: https://www.svgrepo.com/show/7876/speedometer.svg
    url: https://api.v2fly.org/checkConnection.svgz
    interval: 600
    timeout: 120000
    tolerance: 500
    max-failed-times: 6
    lazy: true
    proxies:
      - {{user_proxy_names}} # اینجا هم نام پروکسی‌های کاربر

  - name: "پشتیبان (در صورت قطعی) 🧯"
    type: fallback
    icon: https://www.svgrepo.com/show/415208/backup-cloud-document.svg
    url: https://www.gstatic.com/generate_204
    interval: 600
    timeout: 120000
    max-failed-times: 3
    lazy: true
    proxies:
      - {{user_proxy_names}} # اینجا هم نام پروکسی‌های کاربر

  - name: "دانلود منیجر 📥"
    type: select
    icon: https://www.svgrepo.com/show/475147/download-square.svg
    proxies:
      - "بدون فیلترشکن 🛡️"
      - "نوع انتخاب پروکسی 🔀"
      - "خودکار (بهترین پینگ) 🤖"
      - "دستی 🤏🏻"
      - "پشتیبان (در صورت قطعی) 🧯"
      - "اجازه ندادن 🚫"

  - name: "تلگرام 💬"
    type: select
    icon: https://www.svgrepo.com/show/354443/telegram.svg
    proxies:
      - "نوع انتخاب پروکسی 🔀"
      - "بدون فیلترشکن 🛡️"
      - "خودکار (بهترین پینگ) 🤖"
      - "دستی 🤏🏻"
      - "پشتیبان (در صورت قطعی) 🧯"
      - "اجازه ندادن 🚫"

  - name: "یوتیوب ▶️"
    type: select
    icon: https://www.svgrepo.com/show/475700/youtube-color.svg
    proxies:
      - "نوع انتخاب پروکسی 🔀"
      - "خودکار (بهترین پینگ) 🤖"
      - "دستی 🤏🏻"
      - "پشتیبان (در صورت قطعی) 🧯"
      - "اجازه ندادن 🚫"
      - "بدون فیلترشکن 🛡️"

  - name: "گوگل 🌍"
    type: select
    icon: https://www.svgrepo.com/show/475656/google-color.svg
    proxies:
      - "نوع انتخاب پروکسی 🔀"
      - "بدون فیلترشکن 🛡️"
      - "خودکار (بهترین پینگ) 🤖"
      - "دستی 🤏🏻"
      - "پشتیبان (در صورت قطعی) 🧯"
      - "اجازه ندادن 🚫"

  - name: "واتس آپ 🟢"
    type: select
    icon: https://upload.wikimedia.org/wikipedia/commons/4/4c/WhatsApp_Logo_green.svg
    proxies:
      - "نوع انتخاب پروکسی 🔀"
      - "خودکار (بهترین پینگ) 🤖"
      - "دستی 🤏🏻"
      - "پشتیبان (در صورت قطعی) 🧯"
      - "اجازه ندادن 🚫"
      - "بدون فیلترشکن 🛡️"

  - name: "هوش مصنوعی 🤖"
    type: select
    icon: https://www.svgrepo.com/show/306500/openai.svg
    proxies:
      - "نوع انتخاب پروکسی 🔀"
      - "بدون فیلترشکن 🛡️"
      - "خودکار (بهترین پینگ) 🤖"
      - "دستی 🤏🏻"
      - "پشتیبان (در صورت قطعی) 🧯"
      - "اجازه ندادن 🚫"

  - name: "اینستاگرام 📸"
    type: select
    icon: https://www.svgrepo.com/show/452229/instagram-1.svg
    proxies:
      - "نوع انتخاب پروکسی 🔀"
      - "خودکار (بهترین پینگ) 🤖"
      - "دستی 🤏🏻"
      - "پشتیبان (در صورت قطعی) 🧯"
      - "اجازه ندادن 🚫"
      - "بدون فیلترشکن 🛡️"

  - name: "تبلیغات 🆎"
    type: select
    icon: https://www.svgrepo.com/show/336358/ad.svg
    proxies:
      - "اجازه ندادن 🚫"
      - "نوع انتخاب پروکسی 🔀"
      - "خودکار (بهترین پینگ) 🤖"
      - "دستی 🤏🏻"
      - "پشتیبان (در صورت قطعی) 🧯"
      - "بدون فیلترشکن 🛡️"

  - name: "تبلیغات اپ ها 🍃"
    type: select
    icon: https://www.svgrepo.com/show/12172/smartphone-ad.svg
    proxies:
      - "اجازه ندادن 🚫"
      - "نوع انتخاب پروکسی 🔀"
      - "خودکار (بهترین پینگ) 🤖"
      - "دستی 🤏🏻"
      - "پشتیبان (در صورت قطعی) 🧯"
      - "بدون فیلترشکن 🛡️"

  - name: "رهگیری جهانی 🛑"
    type: select
    icon: https://www.svgrepo.com/show/298725/tracking-track.svg
    proxies:
      - "اجازه ندادن 🚫"
      - "نوع انتخاب پروکسی 🔀"
      - "خودکار (بهترین پینگ) 🤖"
      - "دستی 🤏🏻"
      - "پشتیبان (در صورت قطعی) 🧯"
      - "بدون فیلترشکن 🛡️"

  - name: "سایتای مخرب ⚠️"
    type: select
    icon: https://www.svgrepo.com/show/381135/cyber-crime-cyber-phishing-fraud-hack-money.svg
    proxies:
      - "اجازه ندادن 🚫"
      - "نوع انتخاب پروکسی 🔀"
      - "خودکار (بهترین پینگ) 🤖"
      - "دستی 🤏🏻"
      - "پشتیبان (در صورت قطعی) 🧯"
      - "بدون فیلترشکن 🛡️"

  - name: "استیم 🖥️"
    type: select
    icon: https://www.svgrepo.com/show/452107/steam.svg
    proxies:
      - "نوع انتخاب پروکسی 🔀"
      - "بدون فیلترشکن 🛡️"
      - "خودکار (بهترین پینگ) 🤖"
      - "دستی 🤏🏻"
      - "پشتیبان (در صورت قطعی) 🧯"
      - "اجازه ندادن 🚫"

  - name: "گیم 🎮"
    type: select
    icon: https://www.svgrepo.com/show/167729/game-controller.svg
    proxies:
      - "نوع انتخاب پروکسی 🔀"
      - "بدون فیلترشکن 🛡️"
      - "خودکار (بهترین پینگ) 🤖"
      - "دستی 🤏🏻"
      - "پشتیبان (در صورت قطعی) 🧯"
      - "اجازه ندادن 🚫"

  - name: "سایتای ایرانی 🇮🇷"
    type: select
    icon: https://upload.wikimedia.org/wikipedia/commons/3/36/Flag_of_Iran_%28civil%29.svg
    proxies:
      - "بدون فیلترشکن 🛡️"
      - "نوع انتخاب پروکسی 🔀"
      - "خودکار (بهترین پینگ) 🤖"
      - "دستی 🤏🏻"
      - "پشتیبان (در صورت قطعی) 🧯"
      - "اجازه ندادن 🚫"

  - name: "ویندوز 🧊"
    type: select
    icon: https://icon.icepanel.io/Technology/svg/Windows-11.svg
    proxies:
      - "نوع انتخاب پروکسی 🔀"
      - "بدون فیلترشکن 🛡️"
      - "اجازه ندادن 🚫"
      - "خودکار (بهترین پینگ) 🤖"
      - "دستی 🤏🏻"
      - "پشتیبان (در صورت قطعی) 🧯"

  - name: "کلودفلر ☁️"
    type: select
    icon: https://icon.icepanel.io/Technology/svg/Cloudflare.svg
    proxies:
      - "نوع انتخاب پروکسی 🔀"
      - "بدون فیلترشکن 🛡️"
      - "خودکار (بهترین پینگ) 🤖"
      - "دستی 🤏🏻"
      - "پشتیبان (در صورت قطعی) 🧯"
      - "اجازه ندادن 🚫"

  - name: "استریمیو 🎬"
    type: select
    icon: https://stremio.github.io/stremio-addon-guide/img/stremio.svg
    proxies:
      - "نوع انتخاب پروکسی 🔀"
      - "بدون فیلترشکن 🛡️"
      - "خودکار (بهترین پینگ) 🤖"
      - "دستی 🤏🏻"
      - "پشتیبان (در صورت قطعی) 🧯"
      - "اجازه ندادن 🚫"

  - name: "سایتای سانسوری 🤬"
    type: select
    icon: https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Censorship.svg/300px-Censorship.svg.png
    proxies:
      - "اجازه ندادن 🚫"
      - "نوع انتخاب پروکسی 🔀"
      - "خودکار (بهترین پینگ) 🤖"
      - "دستی 🤏🏻"
      - "پشتیبان (در صورت قطعی) 🧯"
      - "بدون فیلترشکن 🛡️"

  - name: "بدون فیلترشکن 🛡️"
    type: select
    icon: https://www.svgrepo.com/show/6318/connection.svg
    hidden: true
    proxies:
      - DIRECT

  - name: "قطع اینترنت ⛔"
    type: select
    icon: https://www.svgrepo.com/show/305372/wifi-off.svg
    hidden: true
    proxies:
      - REJECT

  - name: "اجازه ندادن 🚫"
    type: select
    icon: https://www.svgrepo.com/show/444307/gui-ban.svg
    hidden: true
    proxies:
      - REJECT

rules:
  - RULE-SET,DownloadManagers,دانلود منیجر 📥
  - RULE-SET,Download,دانلود منیجر 📥
  - RULE-SET,stremio,استریمیو 🎬
  - RULE-SET,BanProgramAD,تبلیغات اپ ها 🍃
  - RULE-SET,BanAD,رهگیری جهانی 🛑
  - RULE-SET,PrivateTracker,رهگیری جهانی 🛑
  - RULE-SET,category_public_tracker,رهگیری جهانی 🛑
  - RULE-SET,malware,سایتای مخرب ⚠️
  - RULE-SET,phishing,سایتای مخرب ⚠️
  - RULE-SET,cryptominers,سایتای مخرب ⚠️
  - RULE-SET,warninglist,سایتای مخرب ⚠️
  - RULE-SET,Ponzi,سایتای مخرب ⚠️
  - RULE-SET,LiteAds,تبلیغات 🆎
  - RULE-SET,iran_ads,تبلیغات 🆎
  - RULE-SET,PersianBlocker,تبلیغات 🆎
  - RULE-SET,ads,تبلیغات 🆎
  - RULE-SET,BanEasyList,تبلیغات 🆎
  - RULE-SET,twitch,توییچ 📡
  - PROCESS-NAME,Telegram.exe,تلگرام 💬
  - PROCESS-NAME,org.telegram.messenger,تلگرام 💬
  - PROCESS-NAME,org.telegram.messenger.web,تلگرام 💬
  - RULE-SET,telegram,تلگرام 💬
  - RULE-SET,YouTube,یوتیوب ▶️
  - RULE-SET,youtube,یوتیوب ▶️
  - RULE-SET,YouTubeMusic,یوتیوب ▶️
  - PROCESS-NAME,com.instagram.android,اینستاگرام 📸
  - RULE-SET,instagram,اینستاگرام 📸
  - DOMAIN-SUFFIX,deepseek.com,هوش مصنوعی 🤖
  - DOMAIN-SUFFIX,qwen.ai,هوش مصنوعی 🤖
  - RULE-SET,category-ai,هوش مصنوعی 🤖
  - RULE-SET,censor,سایتای سانسوری 🤬
  - RULE-SET,apps,سایتای ایرانی 🇮🇷
  - RULE-SET,iran,سایتای ایرانی 🇮🇷
  - RULE-SET,arvancloud,سایتای ایرانی 🇮🇷
  - RULE-SET,derakcloud,سایتای ایرانی 🇮🇷
  - RULE-SET,iranserver,سایتای ایرانی 🇮🇷
  - RULE-SET,parspack,سایتای ایرانی 🇮🇷
  - RULE-SET,irasn,سایتای ایرانی 🇮🇷
  - RULE-SET,ir,سایتای ایرانی 🇮🇷
  - RULE-SET,category_ir,سایتای ایرانی 🇮🇷
  - RULE-SET,whatsapp,واتس آپ 🟢
  - RULE-SET,steam,استیم 🖥️
  - RULE-SET,SteamRegionCheck,استیم 🖥️
  - RULE-SET,game,گیم 🎮
  - RULE-SET,GameDownload,گیم 🎮
  - RULE-SET,category-games,گیم 🎮
  - RULE-SET,Xbox,گیم 🎮
  - RULE-SET,discord,دیسکورد 🗣️
  - RULE-SET,xiaomi_white_list,نوع انتخاب پروکسی 🔀
  - RULE-SET,xiaomi-ads,تبلیغات اپ ها 🍃
  - RULE-SET,xiaomi_block_list,تبلیغات اپ ها 🍃
  - RULE-SET,windows,ویندوز 🧊
  - RULE-SET,cloudflare,کلودفلر ☁️
  - RULE-SET,github,گیتهاب 🐙
  - PROCESS-NAME,com.android.vending,نوع انتخاب پروکسی 🔀
  - PROCESS-NAME,com.google.android.gms,نوع انتخاب پروکسی 🔀
  - RULE-SET,google-play,نوع انتخاب پروکسی 🔀
  - RULE-SET,google,گوگل 🌍
  - RULE-SET,local_ips,بدون فیلترشکن 🛡️
  - RULE-SET,private,بدون فیلترشکن 🛡️
  - RULE-SET,ircidr,سایتای ایرانی 🇮🇷
  - IP-CIDR,10.10.34.0/24,نوع انتخاب پروکسی 🔀
  - MATCH,نوع انتخاب پروکسی 🔀
`;

// تمپلت بدون قانون (no_rules.yaml)
const NO_RULES_TEMPLATE_CONTENT = `
# این تمپلت برای کانفیگ Mihomo بدون قوانین پیچیده است.
# تمام ترافیک به پروکسی انتخاب شده کاربر هدایت می‌شود.

global-client-fingerprint: chrome
port: {{mihomo_port}}
socks-port: {{mihomo_socks_port}}
redir-port: 7892
mixed-port: 7893
tproxy-port: 7894
allow-lan: true
tcp-concurrent: true
enable-process: true
find-process-mode: always
ipv6: true
log-level: debug
secret: ''
bind-address: '*'
unified-delay: false
disable-keep-alive: false
keep-alive-idle: 30
keep-alive-interval: 30
profile:
  store-selected: true
  store-fake-ip: true

dns:
  enable: true
  ipv6: true
  respect-rules: false
  prefer-h3: true
  cache-algorithm: arc
  use-system-hosts: true
  use-host: true
  listen: 0.0.0.0:53
  enhanced-mode: fake-ip
  fake-ip-filter-mode: blacklist
  fake-ip-range: 198.18.0.1/16
  fake-ip-filter:
    - '*.lan'
    - '*.localdomain'
    - '*.invalid'
    - '*.localhost'
    - '*.test'
    - '*.local'
    - '*.home.arpa'
    - 'time.*.com'
    - 'ntp.*.com'

  default-nameserver:
    - 8.8.8.8
    - 8.8.4.4
    - 1.0.0.1
    - 1.1.1.1
  nameserver:
    - 'https://dns.nextdns.io/15441b'
    - 'tls://15441b.dns.nextdns.io'
  direct-nameserver:
    - '78.157.42.100'
    - '78.157.42.101'
  proxy-server-nameserver:
    - '2606:4700:4700::1111'
    - '2606:4700:4700::1001'
    - '2001:4860:4860::8888'
    - '2001:4860:4860::8844'
    - '1.1.1.1'
    - '8.8.8.8'
    - '8.8.4.4'
    - '9.9.9.9'
    - '223.5.5.5'
    - '77.88.8.8'

sniffer:
  enable: true
  force-dns-mapping: true
  parse-pure-ip: true
  override-destination: false
  sniff:
    HTTP:
      ports: [80, 8080, 8880, 2052, 2082, 2086, 2095]
    TLS:
      ports: [443, 8443, 2053, 2083, 2087, 2096]

tun:
  enable: true
  stack: mixed
  auto-route: true
  auto-detect-interface: true
  auto-redir: true
  dns-hijack:
    - "any:53"
    - "tcp://any:53"

ntp:
  enable: true
  server: "time.apple.com"
  port: 123
  interval: 30

proxies:
  # این بخش با لیست پروکسی‌های کاربر پر می‌شود: {{user_proxies}}

proxy-groups:
  - name: "All User Proxies"
    type: select
    proxies:
      - {{user_proxy_names}}
      - DIRECT

  - name: "بدون فیلترشکن 🛡️"
    type: select
    icon: https://www.svgrepo.com/show/6318/connection.svg
    hidden: true
    proxies:
      - DIRECT

  - name: "قطع اینترنت ⛔"
    type: select
    icon: https://www.svgrepo.com/show/305372/wifi-off.svg
    hidden: true
    proxies:
      - REJECT

  - name: "اجازه ندادن 🚫"
    type: select
    icon: https://www.svgrepo.com/show/444307/gui-ban.svg
    hidden: true
    proxies:
      - REJECT

rules:
  - MATCH,All User Proxies
`;


class MihomoConfigGenerator {
    static _instance = null;

    _templates = {
        'full_rules': FULL_RULES_TEMPLATE_CONTENT,
        'no_rules': NO_RULES_TEMPLATE_CONTENT
    };

    constructor() {
        if (MihomoConfigGenerator._instance) {
            return MihomoConfigGenerator._instance;
        }
        MihomoConfigGenerator._instance = this;
    }

    getAvailableTemplates() {
        /**
         * لیستی از نام تمپلت‌های MiHoMo موجود را برمی‌گرداند.
         * @returns {Array<string>}
         */
        return Object.keys(this._templates);
    }

    generateConfig(templateName, userProxies, mihomoMainPort = 7890, mihomoSocksPort = 7891) {
        /**
         * یک کانفیگ MiHoMo را بر اساس تمپلت انتخاب شده و پروکسی‌های کاربر تولید می‌کند.
         * @param {string} templateName - نام تمپلت MiHoMo (مثلا 'full_rules').
         * @param {Array<Object>} userProxies - لیستی از آبجکت‌های پروکسی (از generateMihomoProxyConfig پروتکل‌ها).
         * @param {number} mihomoMainPort - پورت اصلی برای Mihomo.
         * @param {number} mihomoSocksPort - پورت SOCKS برای Mihomo.
         * @returns {string | null} - محتوای YAML کانفیگ نهایی Mihomo به صورت رشته، یا null در صورت خطا.
         */
        if (!this._templates[templateName]) {
            console.error(`خطا: تمپلت MiHoMo با نام '${templateName}' یافت نشد.`);
            return null;
        }

        let templateContent = this._templates[templateName];

        // 1. جایگزینی پورت‌های MiHoMo
        templateContent = templateContent.replace(/{{mihomo_port}}/g, String(mihomoMainPort));
        templateContent = templateContent.replace(/{{mihomo_socks_port}}/g, String(mihomoSocksPort));

        // 2. تولید بخش 'proxies' برای MiHoMo
        const generatedProxiesList = userProxies; // اینها قبلاً توسط متد پروتکل فرمت شده‌اند

        // استخراج نام پروکسی‌ها برای بخش proxy-groups
        const proxyNames = generatedProxiesList.map(p => `"${p.name}"`);

        // تبدیل لیست آبجکت‌های پروکسی به رشته YAML برای تزریق در بخش 'proxies'
        let proxiesYamlString;
        if (generatedProxiesList.length > 0) {
            proxiesYamlString = jsyaml.dump(generatedProxiesList, { indent: 2, lineWidth: -1 });
            // حذف خط اول که ' -' اضافی دارد اگر لیست تک عنصری باشد
            // و اطمینان از ایندنت صحیح: هر خط با دو فاصله شروع شود
            proxiesYamlString = proxiesYamlString.split('\n').map(line => `  ${line}`).join('\n');
        } else {
            proxiesYamlString = '  []'; // لیست خالی پروکسی‌ها
        }
        
        // جایگزینی placeholder مربوط به proxies
        templateContent = templateContent.replace('proxies:\n  # این بخش با لیست پروکسی‌های کاربر پر می‌شود: {{user_proxies}}', `proxies:\n${proxiesYamlString}`);


        // 3. جایگزینی نام پروکسی‌ها در 'proxy-groups'
        // اگر user_proxy_names خالی باشد، DIRECT را به عنوان fallback قرار می‌دهیم
        const proxyNamesJoined = proxyNames.length > 0 ? proxyNames.join(',\n      - ') : 'DIRECT';
        templateContent = templateContent.replace(/{{user_proxy_names}}/g, proxyNamesJoined);


        return templateContent;
    }
}

const mihomoConfigGeneratorInstance = new MihomoConfigGenerator();
export default mihomoConfigGeneratorInstance;
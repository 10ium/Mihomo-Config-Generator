// MihomoConfigGenerator.js

const FULL_RULES_TEMPLATE_CONTENT = `
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
geo-update-interval: 168
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
    url: "https://github.com/MasterKia/iran-hosted-domains/releases/latest/download/clash_rules_ads.yaml"
    path: ./ruleset/PersianBlocker.yaml
    interval: 86400
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
    format: yaml
    behavior: domain
    url: "https://github.com/chocolate4u/Iran-clash-rules/releases/latest/download/ir.yaml"
    path: ./ruleset/ir.yaml
    interval: 86400
  apps:
    type: http
    format: yaml
    behavior: classical
    url: "https://github.com/chocolate4u/Iran-clash-rules/releases/latest/download/apps.yaml"
    path: ./ruleset/apps.yaml
    interval: 86400
  ircidr:
    type: http
    format: yaml
    behavior: ipcidr
    url: "https://github.com/chocolate4u/Iran-clash-rules/releases/latest/download/ircidr.yaml"
    path: ./ruleset/ircidr.yaml
    interval: 86400
  irasn:
    type: http
    format: yaml
    behavior: classical
    url: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/irasn.yaml"
    path: ./ruleset/irasn.yaml
    interval: 86400
  arvancloud:
    type: http
    format: yaml
    behavior: ipcidr
    url: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/arvancloud.yaml"
    path: ./ruleset/arvancloud.yaml
    interval: 86400
  derakcloud:
    type: http
    format: yaml
    behavior: ipcidr
    url: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/derakcloud.yaml"
    path: ./ruleset/derakcloud.yaml
    interval: 86400
  iranserver:
    type: http
    format: yaml
    behavior: ipcidr
    url: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/iranserver.yaml"
    path: ./ruleset/iranserver.yaml
    interval: 86400
  parspack:
    type: http
    format: yaml
    behavior: ipcidr
    url: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/parspack.yaml"
    path: ./ruleset/parspack.yaml
    interval: 86400
  malware:
    type: http
    format: yaml
    behavior: domain
    url: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/malware.yaml"
    path: ./ruleset/malware.yaml
    interval: 86400
  phishing:
    type: http
    format: yaml
    behavior: domain
    url: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/phishing.yaml"
    path: ./ruleset/phishing.yaml
    interval: 86400
  cryptominers:
    type: http
    format: yaml
    behavior: domain
    url: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/cryptominers.yaml"
    path: ./ruleset/cryptominers.yaml
    interval: 86400
  ads:
    type: http
    format: yaml
    behavior: domain
    url: "https://raw.githubusercontent.com/Chocolate4U/Iran-clash-rules/release/category-ads-all.yaml"
    path: ./ruleset/ads.yaml
    interval: 86400
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
    url: https://raw.githubusercontent.com/10ium/mihomo_rule/refs/heads/main/warning-list.yaml
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
    format: yaml
    behavior: domain
    url: "https://raw.githubusercontent.com/10ium/clash_rules/refs/heads/main/xiaomi_block_list.yaml"
    path: ./ruleset/xiaomi_block_list.yaml
    interval: 86400
  xiaomi_white_list:
    type: http
    behavior: classical
    url: "https://raw.githubusercontent.com/10ium/clash_rules/refs/heads/main/xiaomi_white_list.yaml"
    path: ./ruleset/xiaomi_white_list.yaml
    interval: 86400
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
    path: ./ruleset/xgithub.yaml
  whatsapp:
    type: http
    behavior: domain
    url: https://raw.githubusercontent.com/10ium/V2rayDomains2Clash/generated/whatsapp.yaml
    interval: 86400
    path: ./ruleset/whatsapp.yaml
  LiteAds:
    type: http
    behavior: classical
    url: "https://raw.githubusercontent.com/10ium/clash_rules/refs/heads/main/LiteAds.yaml"
    path: ./ruleset/LiteAds.yaml
    interval: 86400
  discord:
    type: http
    behavior: classical
    url: "https://raw.githubusercontent.com/10ium/clash_rules/refs/heads/main/discord.yaml"
    path: ./ruleset/discord.yaml
    interval: 86400
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
    url: "https://raw.githubusercontent.com/10ium/clash_rules/refs/heads/main/stremio.yaml"
    path: ./ruleset/stremio.yaml
    interval: 86400
  windows:
    type: http
    behavior: classical
    url: "https://raw.githubusercontent.com/10ium/clash_rules/refs/heads/main/windows.yaml"
    path: ./ruleset/windows.yaml
    interval: 86400


proxies:
  # این بخش با لیست پروکسی‌های کاربر پر می‌شود: {{user_proxies}}

proxy-groups:
  - name: "نوع انتخاب پروکسی 🔀"
    icon: https://www.svgrepo.com/show/412721/choose.svg
    type: select
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
{{user_proxy_names_list}} # <--- این خط با لیست نام‌های پروکسی‌های کاربر پر می‌شود (بدون خط تیره شروع)
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
{{user_proxy_names_list}} # <--- این خط با لیست نام‌های پروکسی‌های کاربر پر می‌شود (بدون خط تیره شروع)
  - name: "پشتیبان (در صورت قطعی) 🧯"
    type: fallback
    icon: https://www.svgrepo.com/show/415208/backup-cloud-document.svg
    url: https://www.gstatic.com/generate_204
    interval: 600
    timeout: 120000
    max-failed-times: 3
    lazy: true
    proxies:
{{user_proxy_names_list}} # <--- این خط با لیست نام‌های پروکسی‌های کاربر پر می‌شود (بدون خط تیره شروع)
  - name: دانلود منیجر 📥
    type: select
    icon: https://www.sadeemrdp.com/fonts/apps/IDM-Logo.svg
    proxies:
      - "بدون فیلترشکن 🛡️"
      - "نوع انتخاب پروکسی 🔀"
      - "خودکار (بهترین پینگ) 🤖"
      - "دستی 🤏🏻"
      - "پشتیبان (در صورت قطعی) 🧯"
      - "اجازه ندادن 🚫"
  - name: تلگرام 💬
    type: select
    icon: https://www.svgrepo.com/show/354443/telegram.svg
    proxies:
      - "نوع انتخاب پروکسی 🔀"
      - "بدون فیلترشکن 🛡️"
      - "خودکار (بهترین پینگ) 🤖"
      - "دستی 🤏🏻"
      - "پشتیبان (در صورت قطعی) 🧯"
      - "اجازه ندادن 🚫"
  - name: یوتیوب ▶️
    type: select
    icon: https://www.svgrepo.com/show/475700/youtube-color.svg
    proxies:
      - "نوع انتخاب پروکسی 🔀"
      - "خودکار (بهترین پینگ) 🤖"
      - "دستی 🤏🏻"
      - "پشتیبان (در صورت قطعی) 🧯"
      - "اجازه ندادن 🚫"
      - "بدون فیلترشکن 🛡️"
  - name: گوگل 🌍
    type: select
    icon: https://www.svgrepo.com/show/475656/google-color.svg
    proxies:
      - "نوع انتخاب پروکسی 🔀"
      - "بدون فیلترشکن 🛡️"
      - "خودکار (بهترین پینگ) 🤖"
      - "دستی 🤏🏻"
      - "پشتیبان (در صورت قطعی) 🧯"
      - "اجازه ندادن 🚫"
  - name: واتس آپ 🟢
    type: select
    icon: https://upload.wikimedia.org/wikipedia/commons/4/4c/WhatsApp_Logo_green.svg
    proxies:
      - "نوع انتخاب پروکسی 🔀"
      - "خودکار (بهترین پینگ) 🤖"
      - "دستی 🤏🏻"
      - "پشتیبان (در صورت قطعی) 🧯"
      - "اجازه ندادن 🚫"
      - "بدون فیلترشکن 🛡️"
  - name: هوش مصنوعی 🤖
    type: select
    icon: https://www.svgrepo.com/show/306500/openai.svg
    proxies:
      - "نوع انتخاب پروکسی 🔀"
      - "بدون فیلترشکن 🛡️"
      - "خودکار (بهترین پینگ) 🤖"
      - "دستی 🤏🏻"
      - "پشتیبان (در صورت قطعی) 🧯"
      - "اجازه ندادن 🚫"
  - name: اینستاگرام 📸
    type: select
    icon: https://www.svgrepo.com/show/452229/instagram-1.svg
    proxies:
      - "نوع انتخاب پروکسی 🔀"
      - "خودکار (بهترین پینگ) 🤖"
      - "دستی 🤏🏻"
      - "پشتیبان (در صورت قطعی) 🧯"
      - "اجازه ندادن 🚫"
      - "بدون فیلترشکن 🛡️"
  - name: تبلیغات 🆎
    type: select
    icon: https://www.svgrepo.com/show/336358/ad.svg
    proxies:
      - "اجازه ندادن 🚫"
      - "نوع انتخاب پروکسی 🔀"
      - "خودکار (بهترین پینگ) 🤖"
      - "دستی 🤏🏻"
      - "پشتیبان (در صورت قطعی) 🧯"
      - "بدون فیلترشکن 🛡️"
  - name: تبلیغات اپ ها 🍃
    type: select
    icon: https://www.svgrepo.com/show/12172/smartphone-ad.svg
    proxies:
      - "اجازه ندادن 🚫"
      - "نوع انتخاب پروکسی 🔀"
      - "خودکار (بهترین پینگ) 🤖"
      - "دستی 🤏🏻"
      - "پشتیبان (در صورت قطعی) 🧯"
      - "بدون فیلترشکن 🛡️"
  - name: رهگیری جهانی 🛑
    type: select
    icon: https://www.svgrepo.com/show/298725/tracking-track.svg
    proxies:
      - "اجازه ندادن 🚫"
      - "نوع انتخاب پروکسی 🔀"
      - "خودکار (بهترین پینگ) 🤖"
      - "دستی 🤏🏻"
      - "پشتیبان (در صورت قطعی) 🧯"
      - "بدون فیلترشکن 🛡️"
  - name: سایتای مخرب ⚠️
    type: select
    icon: https://www.svgrepo.com/show/381135/cyber-crime-cyber-phishing-fraud-hack-money.svg
    proxies:
      - "اجازه ندادن 🚫"
      - "نوع انتخاب پروکسی 🔀"
      - "خودکار (بهترین پینگ) 🤖"
      - "دستی 🤏🏻"
      - "پشتیبان (در صورت قطعی) 🧯"
      - "بدون فیلترشکن 🛡️"
  - name: استیم 🖥️
    type: select
    icon: https://www.svgrepo.com/show/452107/steam.svg
    proxies:
      - "نوع انتخاب پروکسی 🔀"
      - "بدون فیلترشکن 🛡️"
      - "خودکار (بهترین پینگ) 🤖"
      - "دستی 🤏🏻"
      - "پشتیبان (در صورت قطعی) 🧯"
      - "اجازه ندادن 🚫"
  - name: گیم 🎮
    type: select
    icon: https://www.svgrepo.com/show/167729/game-controller.svg
    proxies:
      - "نوع انتخاب پروکسی 🔀"
      - "بدون فیلترشکن 🛡️"
      - "خودکار (بهترین پینگ) 🤖"
      - "دستی 🤏🏻"
      - "پشتیبان (در صورت قطعی) 🧯"
      - "اجازه ندادن 🚫"
  - name: توییچ 📡
    type: select
    icon: https://www.svgrepo.com/show/343527/twitch-network-communication-interaction-connection.svg
    proxies:
      - "نوع انتخاب پروکسی 🔀"
      - "بدون فیلترشکن 🛡️"
      - "خودکار (بهترین پینگ) 🤖"
      - "دستی 🤏🏻"
      - "پشتیبان (در صورت قطعی) 🧯"
      - "اجازه ندادن 🚫"
  - name: سایتای ایرانی 🇮🇷
    type: select
    icon: https://upload.wikimedia.org/wikipedia/commons/3/36/Flag_of_Iran_%28civil%29.svg
    proxies:
      - "بدون فیلترشکن 🛡️"
      - "نوع انتخاب پروکسی 🔀"
      - "خودکار (بهترین پینگ) 🤖"
      - "دستی 🤏🏻"
      - "پشتیبان (در صورت قطعی) 🧯"
      - "اجازه ندادن 🚫"
  - name: ویندوز 🧊
    type: select
    icon: https://icon.icepanel.io/Technology/svg/Windows-11.svg
    proxies:
      - "نوع انتخاب پروکسی 🔀"
      - "بدون فیلترشکن 🛡️"
      - "اجازه ندادن 🚫"
      - "خودکار (بهترین پینگ) 🤖"
      - "دستی 🤏🏻"
      - "پشتیبان (در صورت قطعی) 🧯"
  - name: کلودفلر ☁️
    type: select
    icon: https://icon.icepanel.io/Technology/svg/Cloudflare.svg
    proxies:
      - "نوع انتخاب پروکسی 🔀"
      - "بدون فیلترشکن 🛡️"
      - "خودکار (بهترین پینگ) 🤖"
      - "دستی 🤏🏻"
      - "پشتیبان (در صورت قطعی) 🧯"
      - "اجازه ندادن 🚫"
  - name: گیتهاب 🐙
    type: select
    icon: https://www.svgrepo.com/show/355033/github.svg
    proxies:
      - "نوع انتخاب پروکسی 🔀"
      - "بدون فیلترشکن 🛡️"
      - "خودکار (بهترین پینگ) 🤖"
      - "دستی 🤏🏻"
      - "پشتیبان (در صورت قطعی) 🧯"
      - "اجازه ندادن 🚫"
  - name: دیسکورد 🗣️
    type: select
    icon: https://automatorplugin.com/wp-content/uploads/2024/10/discord-icon.svg
    proxies:
      - "نوع انتخاب پروکسی 🔀"
      - "بدون فیلترشکن 🛡️"
      - "خودکار (بهترین پینگ) 🤖"
      - "دستی 🤏🏻"
      - "پشتیبان (در صورت قطعی) 🧯"
      - "اجازه ندادن 🚫"
  - name: استریمیو 🎬
    type: select
    icon: https://stremio.github.io/stremio-addon-guide/img/stremio.svg
    proxies:
      - "نوع انتخاب پروکسی 🔀"
      - "بدون فیلترشکن 🛡️"
      - "خودکار (بهترین پینگ) 🤖"
      - "دستی 🤏🏻"
      - "پشتیبان (در صورت قطعی) 🧯"
      - "اجازه ندادن 🚫"
  - name: سایتای سانسوری 🤬
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
    proxies:
      - DIRECT
    hidden: true
  - name: "قطع اینترنت ⛔"
    type: select
    icon: https://www.svgrepo.com/show/305372/wifi-off.svg
    proxies:
      - REJECT
    hidden: true
  - name: "اجازه ندادن 🚫"
    type: select
    icon: https://www.svgrepo.com/show/444307/gui-ban.svg
    proxies:
      - REJECT
    hidden: true

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
  - RULE-SET,ircidr,سایتای ایرانی 🇮🇷
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
  - IP-CIDR,10.10.34.0/24,نوع انتخاب پروکسی 🔀
  - RULE-SET,local_ips,بدون فیلترشکن 🛡️
  - RULE-SET,private,بدون فیلترشکن 🛡️
  - MATCH,نوع انتخاب پروکسی 🔀

ntp:
  enable: true
  server: "time.apple.com"
  port: 123
  interval: 30
`;

// تمپلت بدون قانون (no_rules.yaml) - با تغییرات برای پشتیبانی از {{user_proxy_names_comma_separated}} در گروه‌ها
const NO_RULES_TEMPLATE_CONTENT = `
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
      - {{user_proxy_names_comma_separated}} # Changed from {{user_proxy_names_list}}
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
        return Object.keys(this._templates);
    }

    generateConfig(templateName, userProxies, mihomoMainPort = 7890, mihomoSocksPort = 7891) {
        if (!this._templates[templateName]) {
            console.error(`خطا: تمپلت MiHoMo با نام '${templateName}' یافت نشد.`);
            return null;
        }

        let templateContent = this._templates[templateName];

        // 1. جایگزینی پورت‌های MiHoMo
        templateContent = templateContent.replace(/{{mihomo_port}}/g, String(mihomoMainPort));
        templateContent = templateContent.replace(/{{mihomo_socks_port}}/g, String(mihomoSocksPort));

        // 2. تولید بخش 'proxies' برای MiHoMo
        const generatedProxiesList = userProxies;

        // تبدیل لیست آبجکت‌های پروکسی به رشته YAML برای تزریق در بخش 'proxies'
        let proxiesYamlString;
        if (generatedProxiesList.length > 0) {
            proxiesYamlString = jsyaml.dump(generatedProxiesList, { indent: 2, lineWidth: -1 });
            // اضافه کردن ایندنت صحیح به هر خط برای بخش proxies
            // خطوطی که با - شروع می شوند، باید 2 فاصله قبل از - داشته باشند
            // سایر خطوط (که فیلدهای داخل آیتم‌های لیست هستند) باید 4 فاصله داشته باشند.
            proxiesYamlString = proxiesYamlString.split('\n').filter(line => line.trim() !== '').map(line => {
                if (line.startsWith('-')) {
                    return `  ${line}`; // برای آیتم‌های لیست
                }
                return `    ${line}`; // برای فیلدهای داخل آیتم‌های لیست (key: value)
            }).join('\n');
        } else {
            proxiesYamlString = '  []'; // لیست خالی پروکسی‌ها
        }
        
        // جایگزینی placeholder اصلی proxies
        templateContent = templateContent.replace(/(proxies:\s*\n)/, `proxies:\n${proxiesYamlString}\n`);


        // 3. جایگزینی نام پروکسی‌ها در 'proxy-groups'
        // ساخت لیست نام پروکسی‌ها با فرمت صحیح برای گروه‌ها: - "Proxy Name"
        // هر نام در یک خط جداگانه با ایندنت 6 فاصله (برای هماهنگی با -)
        const proxyNamesFormattedForGroups = userProxies.map(p => `      - "${p.name}"`).join('\n');
        
        // ساخت لیست نام پروکسی‌ها با فرمت کاما-جدا شده: "Proxy Name 1", "Proxy Name 2"
        const proxyNamesCommaSeparated = userProxies.map(p => `"${p.name}"`).join(', ');

        // اگر لیست پروکسی‌ها خالی باشد، فقط DIRECT را قرار می‌دهیم
        const finalProxyNamesListForGroups = userProxies.length > 0 ? proxyNamesFormattedForGroups : '      - DIRECT';
        const finalProxyNamesCommaSeparated = userProxies.length > 0 ? proxyNamesCommaSeparated : 'DIRECT';
        
        // جایگزینی تمام occurrences از {{user_proxy_names_list}}
        templateContent = templateContent.replace(/{{user_proxy_names_list}}/g, finalProxyNamesListForGroups);
        // جایگزینی تمام occurrences از {{user_proxy_names_comma_separated}}
        templateContent = templateContent.replace(/{{user_proxy_names_comma_separated}}/g, finalProxyNamesCommaSeparated);


        return templateContent;
    }
}

const mihomoConfigGeneratorInstance = new MihomoConfigGenerator();
export default mihomoConfigGeneratorInstance;

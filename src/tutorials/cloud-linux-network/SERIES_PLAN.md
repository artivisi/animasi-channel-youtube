# Cloud & Linux Network Administration Series

Seri tutorial untuk pemula absolut hingga siap kerja sebagai Junior Network Administrator.

## Target Audience

- Tidak punya pengetahuan komputer sama sekali
- Punya laptop spek menengah ke bawah (Windows)
- Ingin kerja di bidang IT infrastructure / network admin
- Mau belajar dari nol sampai bisa deploy aplikasi ke cloud

## Learning Outcome

Setelah menyelesaikan seri ini, viewer bisa:
- Mengelola server Linux (install, configure, troubleshoot)
- Setup jaringan kantor (LAN, internet, file sharing, VPN)
- Deploy aplikasi web ke cloud server
- Siap melamar posisi Junior Network/System Administrator

## Lab Environment

### Phase 1: VirtualBox + Ubuntu Desktop (Episode 1-7)
- Mulai dengan Ubuntu Desktop agar tidak intimidating
- Viewer lihat bahwa Linux juga punya GUI seperti Windows
- Belajar terminal sambil ada GUI sebagai "safety net"

### Phase 2: VirtualBox + Ubuntu Server (Episode 8-38)
- Transisi ke server (CLI only)
- Simulasi jaringan dengan multiple VM
- Topologi: router, server, client, VPN gateway

### Phase 3: Cloud VPS (Episode 39+)
- Biznet Gio / IDCloudHost (~Rp 50-100rb/bulan)
- Server asli di internet
- Real deployment experience

## Tools & Technologies

- **OS**: Ubuntu 24.04 LTS (Desktop dulu, lalu Server)
- **Virtualization**: VirtualBox (gratis, cross-platform)
- **VPN**: Wireguard + wg-easy
- **Cloud**: Biznet Gio atau IDCloudHost (lokal, murah, support Bahasa Indonesia)
- **Editor**: nano (simple), kemudian vim basics

## Reference Articles

Seri artikel VPN dengan Wireguard di blog:
- [Part I: Pengenalan Wireguard](https://software.endy.muhardin.com/devops/vpn-wireguard-01-intro/)
- [Part II: Internet Proxy](https://software.endy.muhardin.com/devops/vpn-wireguard-02-internet-proxy/)
- [Part III: Expose Aplikasi di Laptop](https://software.endy.muhardin.com/devops/vpn-wireguard-03-publish-laptop/)
- [Part IV: Road Warrior](https://software.endy.muhardin.com/devops/vpn-wireguard-04-roadwarrior/)
- [Part V: Cloud ke On-Premise](https://software.endy.muhardin.com/devops/vpn-wireguard-05-cloud-to-onpremise/)
- [Part VI: Setup dengan wg-easy](https://software.endy.muhardin.com/devops/vpn-wireguard-06-setup-wg-easy/)

---

## Episode Outline

### Module 1: Pengenalan & Setup Lab (Episode 1-5)

#### Episode 1: Apa Itu Komputer dan Sistem Operasi?
**Durasi**: 20-25 menit

Konsep yang dibahas:
- Komputer = Hardware + Software
- Apa itu sistem operasi (penerjemah antara manusia dan hardware)
- Windows, macOS, Linux - apa bedanya?
- Kenapa server pakai Linux? (gratis, stabil, efisien resource)

Hands-on:
- Tidak ada (teori saja)
- Visual: diagram hardware, OS layers

#### Episode 2: Mengenal Linux dan Ubuntu
**Durasi**: 20-25 menit

Konsep yang dibahas:
- Sejarah singkat Linux (Linus Torvalds, open source)
- Apa itu distro? Kenapa banyak "rasa" Linux?
- Ubuntu - distro paling populer untuk pemula
- Desktop vs Server edition
- Kenapa kita pakai Ubuntu saja (fokus, tidak bingung)

Hands-on:
- Demo Ubuntu Desktop (screenshot/video)
- Demo Ubuntu Server (terminal only)
- Comparison dengan Windows

#### Episode 3: Virtualisasi dan Container - Konsep Dasar
**Durasi**: 30-35 menit

Konsep yang dibahas:
- Apa itu virtualisasi? Menjalankan OS di dalam OS
- Full Virtualization vs Containerization
  - **Full Virtualization** (VirtualBox, VMware): setiap VM punya OS sendiri, hypervisor di tengah
  - **Container** (Docker): berbagi kernel dengan host, lebih ringan, untuk aplikasi
- Kapan pakai VM vs Container?
  - VM: belajar OS, simulasi jaringan, isolasi penuh
  - Container: deploy aplikasi, microservices, CI/CD
- Kenapa kita pakai VM dulu? (belajar OS dari dasar, networking)
- Perbandingan software virtualisasi (VirtualBox, VMware, Hyper-V, Parallels)

Hands-on:
- Tidak ada (teori + demo visual)
- Visual: diagram VM vs Container architecture

#### Episode 4: Install VirtualBox
**Durasi**: 30-35 menit

Konsep yang dibahas:
- VirtualBox - gratis dan cross-platform
- Cek apakah laptop support virtualization (VT-x/AMD-V)
- Download dan verifikasi installer

Hands-on:
- Enable virtualization di BIOS (jika perlu)
- Download dan install VirtualBox
- Tour VirtualBox interface
- Pengenalan network modes (NAT, Bridged, Internal)

#### Episode 5: Install Ubuntu Desktop di VirtualBox
**Durasi**: 35-40 menit

Konsep yang dibahas:
- ISO file - seperti CD installer digital
- Alokasi RAM dan storage untuk VM
- Proses instalasi OS

Hands-on:
- Download Ubuntu Desktop ISO
- Buat VM baru (RAM 2GB, disk 25GB)
- Boot dari ISO
- Proses instalasi step-by-step
- Setup user, password, timezone
- First boot dan tour desktop

---

### Module 2: Linux Desktop & Terminal Dasar (Episode 6-10)

#### Episode 6: Tour Ubuntu Desktop dan Buka Terminal
**Durasi**: 25-30 menit

Konsep yang dibahas:
- GNOME desktop environment
- File manager, settings, software center
- Kenapa kita perlu terminal? (power, automation, remote server)
- Terminal ≠ hacking

Hands-on:
- Explore desktop (file manager, settings)
- Install software via GUI (Software Center)
- Buka terminal (Ctrl+Alt+T)
- First commands: `whoami`, `date`, `cal`
- `clear` dan `exit`

#### Episode 7: Navigasi File dan Folder
**Durasi**: 30-35 menit

Konsep yang dibahas:
- Struktur folder di Linux (/, /home, /etc, /var)
- Absolute vs relative path
- Hidden files (dimulai dengan titik)
- Case sensitive!

Hands-on:
- `pwd` - posisi sekarang
- `ls` - list isi folder
- `ls -la` - list dengan detail
- `cd` - pindah folder
- `cd ..` - naik satu level
- `cd ~` - pulang ke home
- Bandingkan dengan File Manager GUI

#### Episode 8: Membuat dan Mengelola File
**Durasi**: 30-35 menit

Konsep yang dibahas:
- File vs Directory
- Cara membaca error message
- Tab completion - hemat waktu!

Hands-on:
- `mkdir` - buat folder
- `touch` - buat file kosong
- `cp` - copy file/folder
- `mv` - pindah/rename
- `rm` - hapus file
- `rm -r` - hapus folder
- Latihan: buat struktur folder project

#### Episode 9: Membaca dan Mengedit File
**Durasi**: 30-35 menit

Konsep yang dibahas:
- Berbagai cara melihat isi file
- Text editor di terminal
- Kapan pakai cat vs less vs nano

Hands-on:
- `cat` - tampilkan isi file
- `less` - baca file panjang (scroll)
- `head` / `tail` - lihat awal/akhir file
- `nano` - edit file sederhana
- Latihan: buat file catatan, edit, simpan

#### Episode 10: User, Permission, dan Sudo
**Durasi**: 35-40 menit

Konsep yang dibahas:
- Multi-user system
- root vs regular user
- Apa itu sudo? (SuperUser DO)
- Permission: read, write, execute (rwx)
- Owner, group, others

Hands-on:
- `sudo` - jalankan sebagai admin
- `chmod` - ubah permission
- `chown` - ubah owner
- Latihan: buat file, ubah permission, test akses

---

### Module 3: Manajemen Sistem (Episode 11-14)

#### Episode 11: Install dan Update Software
**Durasi**: 30-35 menit

Konsep yang dibahas:
- Package manager - "app store" untuk Linux
- apt - package manager Ubuntu
- Repository - sumber software terpercaya
- Kenapa tidak download dari website seperti Windows?

Hands-on:
- `apt update` - refresh daftar software
- `apt upgrade` - update semua software
- `apt install` - install software baru
- `apt remove` - hapus software
- Latihan: install htop, neofetch, tree

#### Episode 12: Process dan Service
**Durasi**: 30-35 menit

Konsep yang dibahas:
- Apa itu process? (program yang sedang jalan)
- Foreground vs background
- Apa itu service/daemon?
- systemd - sistem init modern

Hands-on:
- `ps` - lihat process
- `top` / `htop` - monitor realtime
- `kill` - hentikan process
- `systemctl status/start/stop/restart`
- Latihan: start/stop nginx

#### Episode 13: Storage dan Disk
**Durasi**: 25-30 menit

Konsep yang dibahas:
- Partisi dan filesystem
- Mount point (tidak ada drive letter seperti Windows)
- Cek penggunaan disk

Hands-on:
- `df -h` - disk free (ruang tersisa)
- `du -sh` - disk usage (ukuran folder)
- `lsblk` - list block devices
- Latihan: cari folder terbesar di system

#### Episode 14: Log dan Troubleshooting Dasar
**Durasi**: 30-35 menit

Konsep yang dibahas:
- Semua tercatat di log
- Lokasi log files (/var/log)
- Cara membaca log
- Mindset troubleshooting: baca error message!

Hands-on:
- `journalctl` - baca system log
- `tail -f` - monitor log realtime
- `grep` - cari kata di file
- Latihan: sengaja buat error, cari di log

---

### Module 4: Networking Fundamentals (Episode 15-19)

#### Episode 15: Konsep Jaringan - IP Address dan Subnet
**Durasi**: 35-40 menit

Konsep yang dibahas:
- Apa itu jaringan komputer?
- IP Address - alamat rumah komputer
- IPv4 format (192.168.1.1)
- Private vs Public IP
- Subnet mask - pembatas "RT/RW"
- CIDR notation (/24, /16)

Hands-on:
- Gambar diagram jaringan sederhana
- Hitung: berapa host dalam /24?
- Identifikasi IP di VM kita

#### Episode 16: Gateway, DNS, dan DHCP
**Durasi**: 35-40 menit

Konsep yang dibahas:
- Gateway - pintu keluar ke internet
- DNS - buku telepon internet (nama -> IP)
- DHCP - pembagi IP otomatis
- Analogi: kantor pos, buku telepon, resepsionis

Hands-on:
- Gambar diagram: PC -> Router -> Internet
- Cek gateway dan DNS di VM
- Cek di jaringan rumah sendiri (ipconfig di Windows)

#### Episode 17: Install Ubuntu Server di VirtualBox
**Durasi**: 35-40 menit

Konsep yang dibahas:
- Kenapa sekarang pakai Server? (no GUI = hemat resource)
- Perbedaan install server vs desktop
- Minimal install - kenapa penting untuk server?

Hands-on:
- Download Ubuntu Server ISO
- Buat VM baru (RAM 1GB, disk 10GB)
- Proses instalasi step-by-step
- Setup user, hostname, timezone
- Install OpenSSH server
- First login dan update

#### Episode 18: VirtualBox Network Modes
**Durasi**: 30-35 menit

Konsep yang dibahas:
- NAT - VM bisa akses internet, tidak bisa diakses dari luar
- Bridged - VM dapat IP dari jaringan rumah
- Internal Network - VM hanya bisa berkomunikasi sesama VM
- Host-only - VM bisa berkomunikasi dengan host saja
- Kapan pakai yang mana?

Hands-on:
- Eksperimen ganti network mode
- Test ping dan internet access di tiap mode
- Setup untuk lab selanjutnya

#### Episode 19: Konfigurasi Network di Ubuntu Server
**Durasi**: 35-40 menit

Konsep yang dibahas:
- Netplan - network configuration di Ubuntu modern
- Static IP vs DHCP
- Kapan pakai masing-masing?

Hands-on:
- `ip addr` - lihat IP address
- `ip route` - lihat routing table
- Edit netplan configuration
- Set static IP
- `ping` - test koneksi
- `netplan apply` - terapkan perubahan

---

### Module 5: Remote Access dan Security (Episode 20-23)

#### Episode 20: SSH - Remote Access ke Server
**Durasi**: 35-40 menit

Konsep yang dibahas:
- Apa itu SSH? (Secure Shell)
- Kenapa tidak pakai telnet?
- SSH dari Windows ke Linux
- Ini cara sysadmin kerja sehari-hari!

Hands-on:
- SSH dari Ubuntu Desktop ke Ubuntu Server
- SSH dari Windows host (PowerShell)
- Konfigurasi SSH (/etc/ssh/sshd_config)

#### Episode 21: SSH Key Authentication
**Durasi**: 30-35 menit

Konsep yang dibahas:
- Password vs Key authentication
- Public key dan private key
- Kenapa lebih aman? (tidak bisa brute force)

Hands-on:
- `ssh-keygen` - buat key pair
- `ssh-copy-id` - copy public key ke server
- Login tanpa password
- Disable password authentication

#### Episode 22: Firewall dengan UFW
**Durasi**: 30-35 menit

Konsep yang dibahas:
- Apa itu firewall?
- Allow vs deny
- Port - pintu masuk service
- Common ports: 22 (SSH), 80 (HTTP), 443 (HTTPS)

Hands-on:
- `ufw status`
- `ufw enable`
- `ufw allow ssh`
- `ufw allow 80/tcp`
- `ufw deny` - block port
- Test firewall rules

#### Episode 23: Security Best Practices
**Durasi**: 25-30 menit

Konsep yang dibahas:
- Jangan pakai root langsung
- Keep system updated
- Minimize installed software
- Strong passwords
- SSH key only
- Firewall default deny

Hands-on:
- Checklist hardening
- Buat non-root user dengan sudo
- Setup automatic security updates

---

### Module 6: Lab Jaringan Kantor (Episode 24-28)

#### Episode 24: Topologi dan Setup Lab Multi-VM
**Durasi**: 35-40 menit

Konsep yang dibahas:
- Topologi jaringan kantor kecil
- Router, server, client
- Internal network di VirtualBox

Hands-on:
- Buat 3 VM: router (2 NIC), server, client
- Setup internal network
- Konfigurasi IP di masing-masing VM
- Test ping antar VM

#### Episode 25: Internet Sharing dengan NAT
**Durasi**: 40-45 menit

Konsep yang dibahas:
- NAT (Network Address Translation)
- IP forwarding
- Bagaimana router membagi internet

Hands-on:
- Konfigurasi VM router dengan 2 interface (NAT + Internal)
- Enable IP forwarding
- Setup NAT dengan iptables
- Client bisa akses internet via router

#### Episode 26: DHCP Server untuk Kantor
**Durasi**: 30-35 menit

Konsep yang dibahas:
- Bagaimana DHCP bekerja (DORA)
- Lease time
- Range IP untuk client

Hands-on:
- Install isc-dhcp-server
- Konfigurasi range IP
- Set gateway dan DNS untuk client
- Test: client dapat IP otomatis

#### Episode 27: DNS Server Lokal
**Durasi**: 35-40 menit

Konsep yang dibahas:
- Kenapa perlu DNS lokal?
- Local domain resolution
- Caching DNS

Hands-on:
- Install dnsmasq
- Konfigurasi untuk local domain
- Set DNS di DHCP config
- Test: ping server-kantor.local

#### Episode 28: File Sharing dengan Samba
**Durasi**: 35-40 menit

Konsep yang dibahas:
- SMB/CIFS protocol
- Kenapa Samba? (Windows compatible)
- Share folder dari Linux ke Windows

Hands-on:
- Install Samba
- Buat shared folder
- Konfigurasi smb.conf
- Akses dari Windows (atau Ubuntu Desktop)
- Set permission (read-only vs read-write)

---

### Module 7: Web Server (Episode 29-32)

#### Episode 29: Web Server dengan Nginx
**Durasi**: 35-40 menit

Konsep yang dibahas:
- Apa itu web server?
- Nginx - modern dan efisien
- Document root
- Static files

Hands-on:
- Install nginx
- Akses dari browser
- Edit halaman default
- Upload file HTML sendiri

#### Episode 30: Virtual Host - Multiple Website
**Durasi**: 30-35 menit

Konsep yang dibahas:
- Satu server, banyak website
- Server block di Nginx
- Domain name dan /etc/hosts

Hands-on:
- Buat 2 website di satu server
- Konfigurasi server blocks
- Edit hosts file di client
- Test akses kedua website

#### Episode 31: Reverse Proxy Dasar
**Durasi**: 30-35 menit

Konsep yang dibahas:
- Apa itu reverse proxy?
- Menyembunyikan backend server
- Use case: Node.js/Python app di belakang Nginx

Hands-on:
- Install simple HTTP server (Python)
- Konfigurasi Nginx sebagai reverse proxy
- Test akses melalui proxy

#### Episode 32: Load Balancer Sederhana
**Durasi**: 35-40 menit

Konsep yang dibahas:
- Apa itu load balancing?
- Round-robin distribution
- High availability concept

Hands-on:
- Setup 2 backend web server
- Konfigurasi Nginx upstream
- Test load balancing (lihat beda response)

---

### Module 8: VPN dengan Wireguard (Episode 33-38)

> Berdasarkan seri artikel: https://software.endy.muhardin.com/devops/vpn-wireguard-01-intro/

#### Episode 33: Pengenalan VPN dan Wireguard
**Durasi**: 30-35 menit
**Referensi**: [Part I: Pengenalan Wireguard](https://software.endy.muhardin.com/devops/vpn-wireguard-01-intro/)

Konsep yang dibahas:
- Apa itu VPN? Kenapa perlu?
- Use case: remote work, bypass geo-block, secure public WiFi
- Wireguard vs OpenVPN vs IPSec
- Peer-to-peer architecture (tidak ada server/client)
- Public key & private key

Hands-on:
- Install wireguard
- Generate key pair dengan `wg genkey`
- Buat interface wireguard manual
- Konsep dasar konfigurasi

#### Episode 34: Setup VPN Server dengan wg-easy
**Durasi**: 35-40 menit
**Referensi**: [Part VI: Setup dengan wg-easy](https://software.endy.muhardin.com/devops/vpn-wireguard-06-setup-wg-easy/)

Konsep yang dibahas:
- wg-easy - cara mudah setup Wireguard
- Docker untuk deployment
- Web UI untuk manage client

Hands-on:
- Install Docker di Ubuntu Server
- Deploy wg-easy dengan docker-compose
- Akses web UI
- Buat client configuration
- Download config / scan QR code

#### Episode 35: VPN sebagai Internet Proxy
**Durasi**: 35-40 menit
**Referensi**: [Part II: Internet Proxy](https://software.endy.muhardin.com/devops/vpn-wireguard-02-internet-proxy/)

Konsep yang dibahas:
- Semua traffic lewat VPN
- Bypass ISP throttling
- Aman di public WiFi (kafe, bandara)
- IP forwarding dan NAT

Hands-on:
- Konfigurasi VPN gateway sebagai internet proxy
- Enable IP forwarding
- Setup iptables untuk NAT/masquerade
- Test dari client: `curl ifconfig.me`
- Verifikasi IP berubah

#### Episode 36: Road Warrior - Karyawan WFH Akses Kantor
**Durasi**: 40-45 menit
**Referensi**: [Part IV: Road Warrior](https://software.endy.muhardin.com/devops/vpn-wireguard-04-roadwarrior/)

Konsep yang dibahas:
- Skenario: karyawan di rumah perlu akses server kantor
- Split tunnel vs full tunnel
- AllowedIPs untuk routing spesifik
- PersistentKeepalive untuk NAT traversal

Hands-on:
- Setup VPN gateway di "kantor" (VM)
- Konfigurasi internal gateway
- Buat config untuk "road warrior"
- Test akses ke internal server dari "rumah"
- Akses file share, printer, dll

#### Episode 37: Expose Aplikasi Lokal ke Internet
**Durasi**: 35-40 menit
**Referensi**: [Part III: Expose Aplikasi di Laptop](https://software.endy.muhardin.com/devops/vpn-wireguard-03-publish-laptop/)

Konsep yang dibahas:
- Laptop di belakang NAT, tidak punya public IP
- Port forwarding via VPN gateway
- DNAT dan SNAT dengan iptables
- Alternative: Nginx reverse proxy

Hands-on:
- Jalankan web server di laptop/VM lokal
- Konfigurasi port forwarding di VPN gateway
- Setup iptables rules
- Test akses dari internet via gateway IP
- Bonus: setup dengan Nginx + SSL

#### Episode 38: Menghubungkan Cloud dengan On-Premise
**Durasi**: 40-45 menit
**Referensi**: [Part V: Cloud ke On-Premise](https://software.endy.muhardin.com/devops/vpn-wireguard-05-cloud-to-onpremise/)

Konsep yang dibahas:
- Hybrid cloud scenario
- Aplikasi di cloud perlu akses database di kantor
- Site-to-site VPN
- Routing antar subnet

Hands-on:
- Setup VPN tunnel antara 2 "site"
- Konfigurasi routing untuk subnet masing-masing
- Test koneksi database dari "cloud" ke "on-premise"
- Monitoring dan troubleshooting

---

### Module 9: Cloud Deployment (Episode 39-43)

#### Episode 39: Pengenalan Cloud Computing
**Durasi**: 25-30 menit

Konsep yang dibahas:
- On-premise vs Cloud
- IaaS, PaaS, SaaS
- Provider lokal: Biznet Gio, IDCloudHost
- Pricing dan estimasi biaya

Hands-on:
- Daftar akun di cloud provider
- Tour dashboard
- Lihat pricing calculator

#### Episode 40: Deploy Server Pertama di Cloud
**Durasi**: 35-40 menit

Konsep yang dibahas:
- Instance/VPS selection
- Region dan latency
- Perbedaan dengan VM di laptop

Hands-on:
- Buat VPS Ubuntu Server
- Connect via SSH (dari rumah!)
- Basic hardening (update, firewall, non-root user)
- Setup SSH key

#### Episode 41: Domain dan DNS
**Durasi**: 30-35 menit

Konsep yang dibahas:
- Cara beli domain
- DNS records (A, CNAME, MX)
- Pointing domain ke VPS
- TTL dan propagation

Hands-on:
- Pointing domain ke VPS
- Buat A record
- Test dengan nslookup/dig
- Akses server via domain

#### Episode 42: SSL dengan Let's Encrypt
**Durasi**: 30-35 menit

Konsep yang dibahas:
- HTTP vs HTTPS
- SSL/TLS certificate
- Let's Encrypt - SSL gratis
- Auto-renewal

Hands-on:
- Install certbot
- Generate SSL certificate
- Konfigurasi Nginx HTTPS
- Test https://yourdomain.com
- Setup auto-renewal

#### Episode 43: Deploy Aplikasi Web
**Durasi**: 40-45 menit

Konsep yang dibahas:
- Deployment workflow
- Process manager (systemd)
- Environment variables

Hands-on:
- Deploy aplikasi Node.js sederhana
- Setup sebagai systemd service
- Nginx reverse proxy ke aplikasi
- Test dengan domain + HTTPS

---

### Module 10: Monitoring & Maintenance (Episode 44-47)

#### Episode 44: Monitoring Dasar
**Durasi**: 30-35 menit

Konsep yang dibahas:
- Kenapa monitoring penting?
- Metrics: CPU, RAM, disk, network
- Reactive vs proactive monitoring

Hands-on:
- htop, iotop, nethogs
- `uptime`, `free -h`, `df -h`
- Setup simple dashboard (glances)

#### Episode 45: Log Management
**Durasi**: 30-35 menit

Konsep yang dibahas:
- Centralized logging
- Log rotation
- Cari pattern di log

Hands-on:
- Konfigurasi logrotate
- grep dan awk untuk log analysis
- Simple log monitoring script

#### Episode 46: Backup dan Restore
**Durasi**: 35-40 menit

Konsep yang dibahas:
- 3-2-1 backup rule
- Full vs incremental backup
- Backup strategy untuk VPS

Hands-on:
- Backup dengan tar
- Rsync untuk incremental
- Cron job untuk automated backup
- Test restore

#### Episode 47: Maintenance Checklist dan Penutup
**Durasi**: 30-35 menit

Konsep yang dibahas:
- Routine maintenance tasks
- Kapan upgrade/scale?
- Career path: apa selanjutnya?
- Sertifikasi yang relevan (LPIC, CompTIA)

Hands-on:
- Buat checklist maintenance
- Review semua yang sudah dipelajari
- Resources untuk belajar lanjut

---

## Summary

| Module | Episode | Lab Environment | Topics |
|--------|---------|-----------------|--------|
| 1. Pengenalan & Setup | 1-5 | VirtualBox + Ubuntu Desktop | Komputer, OS, virtualisasi vs container, VM, instalasi |
| 2. Linux Desktop & Terminal | 6-10 | VirtualBox + Ubuntu Desktop | Terminal, navigasi, file, permission |
| 3. Manajemen Sistem | 11-14 | VirtualBox + Ubuntu Desktop | apt, process, disk, log |
| 4. Networking Fundamentals | 15-19 | VirtualBox + Ubuntu Server | IP, subnet, DNS, DHCP, netplan |
| 5. Remote Access & Security | 20-23 | VirtualBox + Ubuntu Server | SSH, firewall, hardening |
| 6. Lab Jaringan Kantor | 24-28 | VirtualBox (Multiple VMs) | NAT, DHCP server, DNS, Samba |
| 7. Web Server | 29-32 | VirtualBox + Ubuntu Server | Nginx, vhost, reverse proxy, LB |
| 8. VPN dengan Wireguard | 33-38 | VirtualBox + Ubuntu Server | VPN, wg-easy, road warrior, site-to-site |
| 9. Cloud Deployment | 39-43 | Cloud VPS (Biznet/IDCloud) | VPS, domain, SSL, app deployment |
| 10. Monitoring & Maintenance | 44-47 | Cloud VPS | Monitoring, logs, backup, maintenance |

**Total: 47 episode**

---

## Resource Requirements

### Minimum Laptop Specs
- Windows 10/11 (64-bit)
- RAM 8GB (recommended), 4GB (minimum, akan lambat)
- Storage 50GB free
- Processor dengan virtualization support (VT-x/AMD-V)

### Budget untuk Cloud (Module 9-10)
- Domain: ~Rp 100-150rb/tahun (.com)
- VPS: ~Rp 50-100rb/bulan (1 vCPU, 1GB RAM)
- Total: ~Rp 200-400rb untuk 2-3 bulan praktek

---

## Production Notes

### Visual Components Needed
- Network topology diagrams (setiap episode networking)
- Terminal recording dengan zoom/highlight
- Side-by-side comparison (GUI vs CLI)
- Animated diagrams untuk konsep (DHCP DORA, NAT, DNS resolution, VPN tunnel)

### Episode Structure
1. **Intro** (30 detik) - Apa yang akan dipelajari
2. **Konsep** (5-10 menit) - Teori dengan visual
3. **Hands-on** (15-25 menit) - Praktek langsung
4. **Recap** (2-3 menit) - Ringkasan key points
5. **Outro** (30 detik) - Preview episode berikutnya

### Checkpoint Quizzes
- Akhir Module 3: Linux basics quiz
- Akhir Module 5: Networking & security quiz
- Akhir Module 7: Server services quiz
- Akhir Module 8: VPN quiz
- Akhir Module 10: Final comprehensive quiz

### Downloadable Resources
- Cheat sheet tiap module
- Config file templates (netplan, nginx, wireguard, docker-compose)
- Lab topology diagrams
- Troubleshooting flowcharts

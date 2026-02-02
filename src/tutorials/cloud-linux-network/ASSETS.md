# CLNA Series - Visual Assets

Asset list untuk video production. Status: [ ] Pending, [x] Done

---

## Module 1: Pengenalan & Setup Lab (Episode 1-5)

### Episode 1: Apa Itu Komputer dan Sistem Operasi?

| ID | Type | Description | Status |
|----|------|-------------|--------|
| M1E1-01 | Diagram | **Hardware Components** - CPU, RAM, Storage, Motherboard dengan label | [x] |
| M1E1-02 | Diagram | **OS Layers** - Hardware → OS → Applications (animated stack) | [x] |
| M1E1-03 | Comparison | **OS Comparison Chart** - Windows vs macOS vs Linux (logo, price, use case) | [x] |
| M1E1-04 | Infographic | **Why Servers Use Linux** - Free, stable, efficient, secure (icons) | [x] |

### Episode 2: Mengenal Linux dan Ubuntu

| ID | Type | Description | Status |
|----|------|-------------|--------|
| M1E2-01 | Timeline | **Linux History** - 1991 Linus → kernel → distros (simple timeline) | [x] |
| M1E2-02 | Diagram | **What is a Distro?** - Kernel + packages + desktop = distro | [x] |
| M1E2-03 | Comparison | **Popular Distros** - Ubuntu, Fedora, Debian, Arch (logos + one-liner) | [x] |
| M1E2-04 | Screenshot | **Ubuntu Desktop** - Clean GNOME desktop with labels | [ ] |
| M1E2-05 | Screenshot | **Ubuntu Server** - Terminal only, showing login prompt | [ ] |
| M1E2-06 | Comparison | **Desktop vs Server** - Side by side, GUI vs CLI, resource usage | [x] |

### Episode 3: Virtualisasi dan Container - Konsep Dasar

| ID | Type | Description | Status |
|----|------|-------------|--------|
| M1E3-01 | Diagram | **Full Virtualization Architecture** - Host → Hypervisor → Guest OS → Apps | [x] |
| M1E3-02 | Diagram | **Container Architecture** - Host → Container Engine → Containers (shared kernel) | [x] |
| M1E3-03 | Comparison | **VM vs Container** - Side by side architecture comparison | [x] |
| M1E3-04 | Comparison | **When to Use VM vs Container** - Use cases table | [x] |
| M1E3-05 | Comparison | **Virtualization Software Comparison** - See detailed table below | [x] |
| M1E3-06 | Screenshot | **VirtualBox Website** - virtualbox.org download page | [x] |
| M1E3-07 | Screenshot | **VMware Workstation Player Website** - vmware.com download page | [x] |
| M1E3-08 | Screenshot | **Hyper-V Info** - Microsoft docs / Windows features page | [x] |
| M1E3-09 | Screenshot | **Parallels Website** - parallels.com homepage | [x] |
| M1E3-10 | Screenshot | **Docker Website** - docker.com homepage | [x] |

#### M1E3-05: Virtualization Software Comparison (Detail)

| Software | OS Support | Price | Type | Pros | Cons |
|----------|------------|-------|------|------|------|
| **VirtualBox** | Win/Mac/Linux | Free | Full VM | Cross-platform, open source, banyak tutorial | Agak lambat |
| **VMware Workstation Player** | Win/Linux | Free (personal) | Full VM | Performa bagus, stabil | Fitur terbatas |
| **VMware Fusion** | macOS | $150+ | Full VM | Performa bagus di Mac | Bayar |
| **Hyper-V** | Win Pro/Enterprise | Free (built-in) | Full VM | Native Windows, cepat | Hanya Win Pro |
| **Parallels** | macOS | ~$100/tahun | Full VM | Sangat cepat di Mac | Bayar, hanya Mac |
| **UTM** | macOS (Apple Silicon) | Free | Full VM | Support M1/M2/M3 Mac | Hanya macOS |
| **Docker** | Win/Mac/Linux | Free | Container | Ringan, cepat, standar industri | Bukan full OS |
| **Podman** | Linux (+ Win/Mac) | Free | Container | Rootless, daemonless | Kurang populer |

**Rekomendasi**: VirtualBox (gratis, cross-platform, works di Windows Home)

#### M1E3-03/04: VM vs Container Comparison (Detail)

| Aspect | Full Virtualization (VM) | Containerization |
|--------|--------------------------|------------------|
| **Architecture** | Hardware → Hypervisor → Guest OS → Apps | Hardware → Host OS → Container Engine → Apps |
| **Isolation** | Complete (separate kernel) | Process-level (shared kernel) |
| **Boot time** | Minutes | Seconds |
| **Resource usage** | Heavy (GB per VM) | Light (MB per container) |
| **OS flexibility** | Any OS (Windows, Linux, etc) | Same OS family as host |
| **Use case** | Learning OS, network simulation, legacy apps | Microservices, CI/CD, app deployment |
| **Examples** | VirtualBox, VMware, Hyper-V | Docker, Podman, containerd |

### Episode 4: Install VirtualBox

| ID | Type | Description | Status |
|----|------|-------------|--------|
| M1E4-01 | Screenshot | **BIOS Virtualization Setting** - Where to find VT-x/AMD-V | [ ] |
| M1E4-02 | Diagram | **VirtualBox Network Modes** - NAT, Bridged, Internal, Host-only (preview) | [x] |
| M1E4-03 | Screenshot | **VirtualBox Manager** - Main interface with labels | [ ] |

### Episode 5: Install Ubuntu Desktop di VirtualBox

| ID | Type | Description | Status |
|----|------|-------------|--------|
| M1E5-01 | Diagram | **What is ISO?** - Digital CD/DVD concept with arrow to VM | [x] |
| M1E5-02 | Infographic | **Recommended VM Settings** - RAM 2GB, Disk 25GB, CPU 2 cores | [x] |
| M1E5-03 | Flowchart | **Installation Steps** - 6-8 step visual flow | [x] |
| M1E5-04 | Checklist | **Post-Install Checklist** - Update, guest additions, snapshot | [x] |

---

## Summary

| Module | Episode Count | Asset Count |
|--------|---------------|-------------|
| Module 1 | 5 | 24 |
| Module 2 | TBD | TBD |
| Module 3 | TBD | TBD |
| ... | ... | ... |

### Asset Types Count (Module 1)

| Type | Count |
|------|-------|
| Diagrams | 8 |
| Comparisons | 6 |
| Screenshots (websites) | 5 |
| Screenshots (software) | 4 |
| Infographic/Flowchart | 4 |
| Timeline | 1 |
| **Total** | **24** |

---

## Production Notes

### Screenshots Captured (Playwright)
- [x] virtualbox.org/wiki/Downloads (`M1E3-06-virtualbox-download.png`)
- [x] vmware.com/products (`M1E3-07-vmware-workstation.png`)
- [x] docs.microsoft.com/hyper-v (`M1E3-08-hyper-v-docs.png`)
- [x] parallels.com (`M1E3-09-parallels.png`)
- [x] docker.com (`M1E3-10-docker.png`)
- [x] ubuntu.com/download/desktop (`M1E2-ubuntu-download.png`)
- [x] ubuntu.com/download/server (`M1E2-ubuntu-server-download.png`)
- [x] mac.getutm.app (`M1E3-utm-mac.png`)
- [x] podman.io (`M1E3-podman.png`)

### Screenshots Requiring Manual Capture
- [ ] Ubuntu Desktop (fresh install in VirtualBox - GNOME with labels)
- [ ] Ubuntu Server (login prompt in VirtualBox)
- [ ] BIOS virtualization setting (generic example)
- [ ] VirtualBox Manager interface

### Diagrams Generated as Remotion Components
- [x] Hardware components (`HardwareComponents.tsx`)
- [x] OS layers animated (`OSLayers.tsx`)
- [x] Distro composition (`WhatIsDistro.tsx`)
- [x] VM architecture (`VMArchitecture.tsx`)
- [x] Container architecture (`ContainerArchitecture.tsx`)
- [x] VM vs Container side-by-side (`VMvsContainer.tsx`)
- [x] VirtualBox network modes (`VirtualBoxNetworkModes.tsx`)
- [x] Installation flowchart (`InstallationSteps.tsx`)
- [x] OS Comparison (`OSComparison.tsx`)
- [x] Why Linux Server (`WhyLinuxServer.tsx`)
- [x] Linux History Timeline (`LinuxHistory.tsx`)
- [x] Popular Distros (`PopularDistros.tsx`)
- [x] Desktop vs Server (`DesktopVsServer.tsx`)
- [x] Virtualization Software Comparison (`VirtualizationComparison.tsx`)
- [x] What is ISO (`WhatIsISO.tsx`)
- [x] VM Settings (`VMSettings.tsx`)
- [x] Post-Install Checklist (`PostInstallChecklist.tsx`)

### Color Scheme
Use CLNA series colors:
- Primary: `#22c55e` (Terminal Green)
- Glow: `#00ff00`
- Background: `#0d1117`
- Text: `#e2e8f0`

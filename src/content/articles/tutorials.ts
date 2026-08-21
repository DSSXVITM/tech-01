import type { Article } from "../types";

/**
 * Static seed tutorials — one per category. The admin CMS (D1 `articles`
 * table) is the real publishing path; these anchor the site at first launch
 * and keep every section populated. Same Article shape as CMS rows.
 */
export const tutorialArticles: Article[] = [
  {
    slug: "speed-up-a-slow-windows-pc",
    title: "How to Speed Up a Slow Windows PC",
    excerpt:
      "No reinstalling required. A 20-minute cleanup that removes startup bloat, frees disk space and makes Windows feel new again.",
    category: "windows",
    tags: ["windows", "performance", "troubleshooting"],
    author: "ai-tech-desk",
    publishedAt: "2026-08-10T06:30:00Z",
    status: "breaking",
    featured: true,
    trendingRank: 1,
    image: {
      src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1600&auto=format&fit=crop",
      cover: "windows",
      alt: "Laptop showing code on screen — speed up a slow Windows PC guide",
    },
    seo: {
      title: "How to Speed Up a Slow Windows PC (20-Minute Guide)",
      description:
        "A step-by-step guide to speeding up a slow Windows PC: disable startup apps, free disk space, fix settings and optional RAM upgrades.",
    },
    related: ["install-remove-software-windows", "fix-weak-wifi-home-network"],
    sources: [
      { label: "Microsoft — Start apps and improve performance", url: "https://support.microsoft.com/en-us/windows/start-apps-and-improve-performance" },
      { label: "Microsoft — Free up drive space", url: "https://support.microsoft.com/en-us/windows/free-up-drive-space-in-windows" },
    ],
    tutorial: {
      difficulty: "beginner",
      timeMinutes: 20,
      prerequisites: [
        "A Windows 10 or Windows 11 PC",
        "Administrator access",
        "About 20 minutes",
      ],
      learn: [
        "Find and disable apps that slow down startup",
        "Free up disk space the safe way",
        "Tweak a few settings that drain performance",
        "Know when an upgrade — not a cleanup — is the fix",
      ],
    },
    content: [
      {
        type: "p",
        text: "A slow Windows PC is rarely broken — it's usually just carrying too much baggage. Startup apps, background bloat and a near-full disk account for most of the sluggishness, and all three are fixable in under half an hour. Here's the exact order we use on every slow machine that lands on our bench.",
      },
      { type: "h2", text: "Step 1 — See what's slowing you down" },
      {
        type: "p",
        text: "Press `Ctrl + Shift + Esc` to open Task Manager. Click the **Startup apps** tab on the left. This list shows everything that launches when Windows starts, with its impact column. Sort by 'Startup impact' and write down the high-impact items you don't recognize or don't need running every boot.",
      },
      {
        type: "callout",
        tone: "info",
        title: "Why startup apps matter",
        text: "Every high-impact startup app steals a few seconds of boot time and a slice of RAM forever. Disabling them doesn't uninstall anything — you can still open the app normally when you need it.",
      },
      { type: "h2", text: "Step 2 — Disable the startup bloat" },
      {
        type: "list",
        ordered: true,
        items: [
          "In the Startup apps tab, select an app and click **Disable**.",
          "Repeat for every high-impact app that isn't essential (keep your antivirus and driver updaters!).",
          "Restart the PC and feel the difference before moving on.",
        ],
      },
      { type: "h2", text: "Step 3 — Free up disk space" },
      {
        type: "p",
        text: "A disk that's more than ~90% full makes Windows crawl. Open **Settings → System → Storage** and click **Cleanup recommendations**. Select the obvious wins — Temporary files, Previous Windows installation, Delivery Optimization Files — then **Clean up**.",
      },
      {
        type: "table",
        columns: ["What it is", "Safe to remove?"],
        rows: [
          ["Temporary files", "Yes — apps recreate them as needed"],
          ["Previous Windows installation", "Yes, but you can't roll back Windows after"],
          ["Recycle Bin", "Yes — it empties the bin"],
          ["Downloads", "Only if you've already saved what you need"],
        ],
      },
      { type: "h2", text: "Step 4 — Tweak performance settings" },
      {
        type: "list",
        ordered: true,
        items: [
          "Open **Settings → System → Power & battery**. Set power mode to **Best performance**.",
          "Open **Settings → System → About → Advanced system settings → Performance → Settings**. Choose **Adjust for best performance**.",
          "Disable visual effects you don't use — you can leave the first two (animations) and keep the rest off.",
        ],
      },
      { type: "h2", text: "Step 5 — Know when to upgrade" },
      {
        type: "p",
        text: "If the PC is still slow after cleanup and the disk is healthy, the bottleneck is usually RAM (add 8–16 GB) or an old hard drive (swap it for an SSD). For machines under 8 GB of RAM, the SSD upgrade alone routinely turns a 3-minute boot into a 30-second one.",
      },
      {
        type: "callout",
        tone: "success",
        title: "The payoff",
        text: "The startup cleanup alone fixes most 'Windows got slow' complaints. Do the disk and settings pass too, and you've delayed any hardware purchase by a year or two.",
      },
    ],
  },
  {
    slug: "set-up-time-machine-backup-mac",
    title: "How to Set Up Time Machine Backup on Your Mac",
    excerpt:
      "A 10-minute setup that automatically backs up your entire Mac — so the 'my files are gone' moment never happens.",
    category: "macos",
    tags: ["macos", "backup", "time machine"],
    author: "ai-tech-desk",
    publishedAt: "2026-08-07T09:00:00Z",
    status: "trending",
    trendingRank: 2,
    image: {
      src: "https://images.unsplash.com/photo-1617216263701-9da79429f643?q=80&w=1600&auto=format&fit=crop",
      cover: "macos",
      alt: "Woman working on a MacBook — Time Machine backup setup",
    },
    seo: {
      title: "How to Set Up Time Machine Backup on Your Mac",
      description:
        "Step-by-step: set up automatic Time Machine backups on macOS with an external drive, restore files from any backup, and never lose data again.",
    },
    related: ["speed-up-a-slow-windows-pc", "create-strong-passwords-2fa"],
    sources: [
      { label: "Apple — Back up with Time Machine", url: "https://support.apple.com/en-us/105900" },
    ],
    tutorial: {
      difficulty: "beginner",
      timeMinutes: 10,
      prerequisites: [
        "An external drive or network share",
        "A Mac on macOS 12 or later",
      ],
      learn: [
        "Turn on automatic Time Machine backups",
        "Choose the right backup drive",
        "Restore a single file from a backup",
        "Exclude folders you don't need backed up",
      ],
    },
    content: [
      {
        type: "p",
        text: "Time Machine is the free backup system built into macOS. Plug in a drive once, and it automatically saves hourly backups of everything on your Mac for the past day, daily for the past month, and weekly for everything older. Here's how to set it up properly.",
      },
      { type: "h2", text: "What you need" },
      {
        type: "list",
        items: [
          "An external drive (USB, Thunderbolt or a network drive). A drive roughly the size of your Mac's internal storage is plenty.",
          "The drive formatted for Mac (APFS or HFS+). If it's brand new, macOS handles this automatically.",
        ],
      },
      { type: "h2", text: "Step-by-step" },
      {
        type: "list",
        ordered: true,
        items: [
          "Plug the drive into your Mac. Click **Use as Backup Disk** when the prompt appears.",
          "If you missed the prompt: open **System Settings → General → Time Machine**.",
          "Click **Add Backup Disk**, select your drive, and click **Use Disk**.",
          "Leave **Back Up Automatically** switched on. That's it — the first backup starts right away.",
          "Keep the drive plugged in (or on the same network) and macOS handles the rest automatically.",
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "First backup takes a while",
        text: "The initial backup copies everything and can take an hour or two. Later backups are tiny — they only save what changed. Keep using your Mac while it runs.",
      },
      { type: "h2", text: "Restoring a deleted file" },
      {
        type: "list",
        ordered: true,
        items: [
          "Open the folder where the file used to live.",
          "Click the **Time Machine** icon (hourglass) in the menu bar and select **Enter Time Machine**.",
          "Use the timeline on the right to travel back, find the file, and press **Restore**.",
        ],
      },
      {
        type: "callout",
        tone: "warn",
        title: "The one setting to check",
        text: "Open Time Machine → **Options**. Confirm your most important folders aren't on the exclude list. Cloud-only folders sometimes get excluded by default.",
      },
    ],
  },
  {
    slug: "build-a-pc-step-by-step",
    title: "How to Build a PC: The Complete Step-by-Step Guide",
    excerpt:
      "Every part, every step, in the right order. Build a reliable PC from parts without breaking anything — including the 'terrifying' CPU step.",
    category: "hardware",
    tags: ["pc build", "hardware", "beginner"],
    author: "ai-tech-desk",
    publishedAt: "2026-08-05T11:00:00Z",
    status: "trending",
    trendingRank: 3,
    image: {
      src: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=1600&auto=format&fit=crop",
      cover: "hardware",
      alt: "Custom PC build with RGB fans — building a computer step by step",
    },
    seo: {
      title: "How to Build a PC: Complete Step-by-Step Guide",
      description:
        "Build your first PC: picking parts, installing CPU, RAM, storage, GPU and PSU in the right order, then first boot and OS install.",
    },
    related: ["speed-up-a-slow-windows-pc", "install-python-first-script"],
    sources: [
      { label: "Tom's Hardware — How to build a PC", url: "https://www.tomshardware.com/how-to/how-to-build-a-pc" },
    ],
    tutorial: {
      difficulty: "intermediate",
      timeMinutes: 60,
      prerequisites: [
        "A Phillips-head screwdriver (magnetic is best)",
        "All your parts: CPU, motherboard, RAM, storage, GPU, PSU, case",
        "A flat, well-lit workspace",
      ],
      learn: [
        "Plan a parts list that actually fits together",
        "Install the CPU, cooler, RAM and storage safely",
        "Wire the power supply correctly",
        "Boot your new PC and install Windows",
      ],
    },
    content: [
      {
        type: "p",
        text: "Building a PC is like advanced LEGO with better documentation. The trick is doing things in the right order so you never have to unplug something to reach another part. This is the exact sequence we use for every build.",
      },
      { type: "h2", text: "Before you start — compatibility" },
      {
        type: "list",
        items: [
          "**CPU ↔ motherboard:** the socket must match (e.g. LGA1700 or AM5). The motherboard box states its socket.",
          "**RAM ↔ motherboard:** DDR4 and DDR5 are not interchangeable — check the board's spec.",
          "**PSU wattage:** a mid-range build needs 650 W; add headroom if you run a big GPU.",
          "**Case size:** make sure the motherboard (ATX/micro-ATX) fits the case.",
        ],
      },
      { type: "h2", text: "Step 1 — Motherboard, outside the case" },
      {
        type: "p",
        text: "Install the CPU, RAM and M.2 storage on the motherboard **before** it goes in the case. This is the single biggest time-saver in PC building.",
      },
      { type: "h2", text: "Step 2 — Install the CPU" },
      {
        type: "list",
        ordered: true,
        items: [
          "Open the socket lever, lift the cover, and align the CPU's gold triangle with the triangle on the socket.",
          "Gently drop the CPU in — it should sit flat with zero pressure. **Never force it.**",
          "Close the cover and lower the lever.",
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "The 'terrifying' part",
        text: "The CPU only fits one way. If it doesn't drop in, you have it rotated wrong — take it out and try again. Bending pins happens from forcing it, not from dropping it in correctly.",
      },
      { type: "h2", text: "Step 3 — Cooler, RAM, storage" },
      {
        type: "list",
        ordered: true,
        items: [
          "Install the CPU cooler per its manual. Thermal paste: a pea-sized dot in the center.",
          "Push RAM sticks into slots A2 and B2 (check the manual) until the clips click.",
          "Screw in the M.2 SSD and press it down; secure with the little screw.",
        ],
      },
      { type: "h2", text: "Step 4 — Into the case" },
      {
        type: "list",
        ordered: true,
        items: [
          "Install the PSU in its bay — fan facing the case's ventilation grille.",
          "Mount the motherboard on its standoffs and screw it down.",
          "Mount the GPU in the top PCIe slot and lock the retention clip.",
        ],
      },
      { type: "h2", text: "Step 5 — Wiring" },
      {
        type: "p",
        text: "The two cables you must get right: the big **24-pin** motherboard power and the **8-pin CPU power** near the top-left of the board. Case wires (power button, LEDs) connect to the front-panel header — the manual has a diagram. Everything else is optional or labeled.",
      },
      { type: "h2", text: "Step 6 — First boot" },
      {
        type: "p",
        text: "Before closing the side panel, plug in a monitor and press power. If it posts (brand logo on screen), congratulations — close the case. Then install Windows from a USB stick: press the boot-menu key (often `F11` or `F12`) at startup and pick the USB.",
      },
      {
        type: "callout",
        tone: "warn",
        title: "If it doesn't boot",
        text: "Check the three most common culprits in order: power switch is on (the PSU rocker), RAM fully seated, CPU power cable connected. A beep code or motherboard LED will usually point you to the exact part.",
      },
    ],
  },
  {
    slug: "install-remove-software-windows",
    title: "How to Install and Uninstall Software on Windows 11",
    excerpt:
      "The safe way to add and remove programs on Windows — including the tools to catch the apps that try to sneak in.",
    category: "software",
    tags: ["windows", "software", "basics"],
    author: "ai-tech-desk",
    publishedAt: "2026-08-03T13:00:00Z",
    status: "live",
    image: {
      src: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1600&auto=format&fit=crop",
      cover: "software",
      alt: "Laptop on a wooden desk — installing and uninstalling software on Windows",
    },
    seo: {
      title: "How to Install and Uninstall Software on Windows 11",
      description:
        "Learn the safe way to install and remove programs in Windows 11, spot bundled junk during setup, and clean up leftovers.",
    },
    related: ["speed-up-a-slow-windows-pc", "fix-weak-wifi-home-network"],
    sources: [
      { label: "Microsoft — Uninstall or remove apps", url: "https://support.microsoft.com/en-us/windows/uninstall-or-remove-apps-in-windows" },
    ],
    tutorial: {
      difficulty: "beginner",
      timeMinutes: 8,
      prerequisites: [
        "A Windows 10 or 11 PC",
        "Administrator access for some installers",
      ],
      learn: [
        "Install apps safely — including spotting bundled junk",
        "Uninstall programs the official way",
        "Remove leftovers that uninstallers miss",
        "Avoid the download-button traps on the web",
      ],
    },
    content: [
      {
        type: "p",
        text: "Installing software should be boring and safe. Most problems — toolbars, mystery pop-ups, machines that 'got slow' — trace back to installs that skipped the uninstaller or let extra software sneak in. Here's the clean routine.",
      },
      { type: "h2", text: "The 3-second rule: where you download from" },
      {
        type: "p",
        text: "Only download from the app's official website or the Microsoft Store. On the web, the big green **Download** button that isn't from the vendor is almost always an ad. Check the URL bar — if it doesn't end in the vendor's domain, close the tab.",
      },
      { type: "h2", text: "Installing — the two-click custom path" },
      {
        type: "list",
        ordered: true,
        items: [
          "Run the downloaded file. If Windows asks, confirm **Yes** to allow it.",
          "Choose **Custom / Advanced** install, not Express/Recommended.",
          "Uncheck every pre-ticked box for toolbars, browsers, or 'offers' — these are the bundled extras.",
          "Click through to Finish. Open the app and confirm it launches.",
        ],
      },
      {
        type: "callout",
        tone: "warn",
        title: "Why Custom install",
        text: "Express installs accept every pre-checked box by default. Ninety percent of 'my computer is full of junk' stories are bundles that were pre-ticked.",
      },
      { type: "h2", text: "Uninstalling properly" },
      {
        type: "list",
        ordered: true,
        items: [
          "Open **Settings → Apps → Installed apps**.",
          "Find the program and click the ⋮ menu → **Uninstall**.",
          "If the built-in uninstaller asks to restart, let it.",
        ],
      },
      { type: "h2", text: "Cleaning up what's left" },
      {
        type: "p",
        text: "Some apps leave folders behind in `C:\\Program Files` or `%AppData%`. Only delete these if you're sure the app is gone and you won't reinstall it. When in doubt, leave them — a stray folder is harmless; a deleted one from a half-removed app is not.",
      },
      {
        type: "code",
        lang: "text",
        text: "%AppData%\n%LocalAppData%\nC:\\Program Files\\C:\\Program Files (x86)",
      },
      {
        type: "callout",
        tone: "success",
        title: "The habit that saves you later",
        text: "Once a quarter, open Installed apps, sort by size, and uninstall the software you don't recognize. It's the cheapest performance boost there is.",
      },
    ],
  },
  {
    slug: "fix-weak-wifi-home-network",
    title: "How to Fix Weak Wi-Fi and Speed Up Your Home Network",
    excerpt:
      "Dead spots, slow rooms and dropped video calls — fix them in 15 minutes with placement, channels and a free Wi-Fi analyzer.",
    category: "internet",
    tags: ["wifi", "networking", "troubleshooting"],
    author: "ai-tech-desk",
    publishedAt: "2026-08-01T10:15:00Z",
    status: "trending",
    trendingRank: 4,
    image: {
      src: "https://images.unsplash.com/photo-1606420187127-dae7c868fa7a?q=80&w=1600&auto=format&fit=crop",
      cover: "internet",
      alt: "White Wi-Fi router on a table — fixing weak home network signal",
    },
    seo: {
      title: "How to Fix Weak Wi-Fi and Speed Up Your Home Network",
      description:
        "Fix weak Wi-Fi: reposition the router, switch to 5 GHz, change the channel, update firmware and use a mesh system when walls are the problem.",
    },
    related: ["speed-up-a-slow-windows-pc", "create-strong-passwords-2fa"],
    sources: [
      { label: "IEEE — Wi-Fi channel guide", url: "https://standards.ieee.org/" },
    ],
    tutorial: {
      difficulty: "beginner",
      timeMinutes: 15,
      prerequisites: [
        "Access to your router's admin page",
        "A phone to test Wi-Fi strength",
      ],
      learn: [
        "Find the best placement for your router",
        "Switch your devices to the faster 5 GHz band",
        "Pick a channel with less interference",
        "Know when to buy a mesh system",
      ],
    },
    content: [
      {
        type: "p",
        text: "Most weak Wi-Fi isn't a bad router — it's the router living in the wrong place, on the wrong band, fighting your neighbors on the same channel. Here's the fix in order of impact.",
      },
      { type: "h2", text: "Step 1 — Placement fixes half the problem" },
      {
        type: "list",
        items: [
          "Put the router in a **central room, off the floor**, not inside a cabinet or behind the TV.",
          "Keep it at least 1 meter from metal objects, aquariums and thick walls.",
          "Point antennas vertically and spread them at angles, not all in a row.",
        ],
      },
      { type: "h2", text: "Step 2 — Use the 5 GHz band" },
      {
        type: "p",
        text: "Your router broadcasts two networks: 2.4 GHz (better range, slower) and 5 GHz (faster, shorter range). Devices on 2.4 GHz are also fighting every neighbor's 2.4 GHz. Connect phones, laptops and TVs to the **5 GHz** name — usually your SSID with '5G' or '-5' in it.",
      },
      {
        type: "table",
        columns: ["Band", "Speed", "Range", "Use for"],
        rows: [
          ["2.4 GHz", "Up to ~100 Mbps", "Long", "Smart home, old devices"],
          ["5 GHz", "Hundreds of Mbps", "Short–medium", "Phones, laptops, streaming"],
          ["6 GHz (Wi-Fi 6E)", "Fastest", "Short", "Newer devices only"],
        ],
      },
      { type: "h2", text: "Step 3 — Change the channel" },
      {
        type: "p",
        text: "Neighboring routers on the same channel interfere with yours. Install a free Wi-Fi analyzer app (WiFi Analyzer on Android, Wireless Diagnostics built into macOS), look at the channel graph, and pick the channel your neighbors aren't using. Most routers let you set it in **Wireless → Channel**.",
      },
      { type: "h2", text: "Step 4 — Update the firmware" },
      {
        type: "p",
        text: "Log into the router admin page (usually `192.168.1.1` or `192.168.0.1`), find **Firmware / Administration**, and update. Router makers ship real speed and security fixes here.",
      },
      { type: "h2", text: "When to buy a mesh system" },
      {
        type: "p",
        text: "If a room consistently has a weak signal after all the above, it's a range problem — no settings tweak fixes physics. A **mesh system** (two or three small nodes) is the modern fix, cheaper than running Ethernet and far better than a range extender for video calls.",
      },
      {
        type: "callout",
        tone: "success",
        title: "Order of operations",
        text: "Placement → 5 GHz → channel → firmware. Do these four before spending a cent. Mesh only when a dead zone survives all of them.",
      },
    ],
  },
  {
    slug: "create-strong-passwords-2fa",
    title: "How to Create Strong Passwords and Turn On 2FA Everywhere",
    excerpt:
      "The only password advice you'll ever need: a password manager plus two-factor authentication. Set both up in 20 minutes.",
    category: "security",
    tags: ["passwords", "2fa", "security basics"],
    author: "ai-tech-desk",
    publishedAt: "2026-07-29T09:30:00Z",
    status: "trending",
    trendingRank: 5,
    image: {
      src: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1600&auto=format&fit=crop",
      cover: "security",
      alt: "Padlock and chain — strong passwords and two-factor authentication",
    },
    seo: {
      title: "How to Create Strong Passwords and Turn On 2FA",
      description:
        "A 20-minute plan: set up a password manager, generate unique strong passwords for every account, and enable two-factor authentication on the accounts that matter.",
    },
    related: ["set-up-time-machine-backup-mac", "install-remove-software-windows"],
    sources: [
      { label: "NIST — Password guidelines", url: "https://pages.nist.gov/800-63-3/sp800-63b.html" },
      { label: "Google — 2-Step Verification", url: "https://www.google.com/landing/2step/" },
    ],
    tutorial: {
      difficulty: "beginner",
      timeMinutes: 20,
      prerequisites: [
        "The email addresses for your important accounts",
        "Your phone (for authenticator apps)",
      ],
      learn: [
        "Why 'a strong password' means a unique one",
        "Set up a password manager in 5 minutes",
        "Replace your weak passwords with generated ones",
        "Turn on 2FA on email, banking and social accounts",
      ],
    },
    content: [
      {
        type: "p",
        text: "There is no 'strong password' trick worth memorizing. The realistic system — used by security professionals themselves — is a password manager that generates a unique password per account, plus two-factor authentication on the accounts that matter. Here's the 20-minute setup.",
      },
      { type: "h2", text: "Why unique passwords beat clever ones" },
      {
        type: "p",
        text: "Hackers don't guess your password one at a time. They leak a database from one site, then try that same email + password on hundreds of others. If your banking password is the same as a forum you joined in 2014, you're one breach away from a drained account. **Unique per site** is the whole game.",
      },
      { type: "h2", text: "Step 1 — Install a password manager" },
      {
        type: "list",
        ordered: true,
        items: [
          "Pick a reputable manager: Bitwarden (free, open source), 1Password or KeePass are all solid.",
          "Install the browser extension and the phone app.",
          "Create one **master password** — long, memorable, used nowhere else. Write it on paper and store it safely.",
          "Let the manager import weak passwords it finds.",
        ],
      },
      { type: "h2", text: "Step 2 — Generate strong passwords" },
      {
        type: "list",
        ordered: true,
        items: [
          "Open an account and click the manager's 'Generate' button when it offers to fill a password.",
          "Use the default 15–20 characters. Don't shorten it.",
          "Let the manager save it. You never need to know it.",
          "Start with email, banking, and social accounts — the ones that reset everything else.",
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "What makes a password strong",
        text: "Length beats complexity. A 16-character generated password is mathematically far stronger than 'Password123!' no matter how clever the substitution tricks are.",
      },
      { type: "h2", text: "Step 3 — Turn on two-factor authentication" },
      {
        type: "p",
        text: "Two-factor (2FA) means that even with your password, someone needs your phone too. Prefer an **authenticator app** (or passkey) over SMS when offered. In every important account: **Security → Two-factor authentication → Set up authenticator app → scan the QR code**.",
      },
      {
        type: "callout",
        tone: "warn",
        title: "Save the backup codes",
        text: "Every service gives you 10 one-time backup codes when you set up 2FA. Store them in your password manager. Without them, a lost phone means a locked account.",
      },
      { type: "h2", text: "The order that matters" },
      {
        type: "p",
        text: "Email first (it resets every other account), then banking, then social. If you only have 20 minutes, those three with 2FA do more than a lifetime of 'clever' passwords.",
      },
    ],
  },
  {
    slug: "install-python-first-script",
    title: "How to Install Python and Write Your First Script",
    excerpt:
      "From zero to 'Hello, world!' in 15 minutes — plus your first genuinely useful script: renaming a hundred files in one go.",
    category: "coding",
    tags: ["python", "programming", "beginner"],
    author: "ai-tech-desk",
    publishedAt: "2026-07-28T09:00:00Z",
    status: "live",
    image: {
      src: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1600&auto=format&fit=crop",
      cover: "coding",
      alt: "Code editor on a screen — installing Python and writing your first script",
    },
    seo: {
      title: "How to Install Python and Write Your First Script",
      description:
        "Install Python on Windows or macOS, write and run your first program, and automate a real task — renaming hundreds of files — with one short script.",
    },
    related: ["build-a-pc-step-by-step", "write-better-ai-prompts"],
    sources: [
      { label: "Python.org — Downloads", url: "https://www.python.org/downloads/" },
    ],
    tutorial: {
      difficulty: "beginner",
      timeMinutes: 15,
      prerequisites: [
        "Any computer (Windows or macOS)",
        "Nothing else — Python installs in one click",
      ],
      learn: [
        "Install Python the safe way (and check it worked)",
        "Write and run your first Python program",
        "Read a basic error message without panic",
        "Automate a real task: batch-rename files",
      ],
    },
    content: [
      {
        type: "p",
        text: "Python is the friendliest way into programming — it reads almost like English, and a single short script can automate work that would take an hour by hand. Let's install it and write something real.",
      },
      { type: "h2", text: "Step 1 — Install Python" },
      {
        type: "list",
        ordered: true,
        items: [
          "Go to [python.org/downloads](https://www.python.org/downloads/) and download the latest version for your OS.",
          "On Windows: run the installer and **check 'Add python.exe to PATH'** at the bottom — this is the step most guides forget.",
          "Click **Install Now**. On macOS: the installer runs the same way.",
        ],
      },
      { type: "h2", text: "Step 2 — Verify the install" },
      {
        type: "p",
        text: "Open a terminal: on Windows press **Win + R**, type `cmd`, press Enter. On macOS, open **Terminal**. Then type this and press Enter:",
      },
      {
        type: "code",
        lang: "bash",
        text: "python --version\n# or, on some systems:\npython3 --version",
      },
      {
        type: "p",
        text: "You should see something like `Python 3.13.x`. If the command isn't found on Windows, the PATH box wasn't checked — reinstall and tick it.",
      },
      { type: "h2", text: "Step 3 — Your first program" },
      {
        type: "p",
        text: "Create a file called `hello.py` (any text editor works — even Notepad), and put this in it:",
      },
      {
        type: "code",
        lang: "python",
        text: "name = input(\"What's your name? \")\nprint(f\"Hello, {name}! Python works.\")",
      },
      {
        type: "p",
        text: "Run it from the terminal in the same folder:",
      },
      {
        type: "code",
        lang: "bash",
        text: "python hello.py",
      },
      { type: "h2", text: "Step 4 — Automate something useful" },
      {
        type: "p",
        text: "Now the part that makes people love Python. This script renames every file in a folder to add a prefix — great for photo batches. Save as `rename.py` in the folder with the files:",
      },
      {
        type: "code",
        lang: "python",
        text: "import os\nfrom pathlib import Path\n\nfolder = Path('.')  # current folder\nprefix = 'holiday_'\n\nfor path in folder.iterdir():\n    if path.is_file() and not path.name.startswith(prefix):\n        path.rename(prefix + path.name)\n        print('Renamed', path.name)",
      },
      {
        type: "p",
        text: "Run it with `python rename.py` and every file in the folder gets the `holiday_` prefix. That's real automation — the same idea powers scripts that sort downloads, back up folders and clean up spreadsheets.",
      },
      {
        type: "callout",
        tone: "warn",
        title: "Reading error messages",
        text: "Errors look scary but are just line numbers. If Python prints `NameError: name 'x' is not defined`, it means a typo. Read the last line first — it almost always names the exact problem.",
      },
      {
        type: "callout",
        tone: "success",
        title: "What to do next",
        text: "Learn three things and you can automate most daily tasks: `for` loops, `if` statements, and the `pathlib` module. There's a free interactive course at [learnpython.org](https://www.learnpython.org/) that covers exactly these.",
      },
    ],
  },
  {
    slug: "write-better-ai-prompts",
    title: "How to Write Better AI Prompts (With Examples)",
    excerpt:
      "ChatGPT and Claude are only as good as the instructions you give them. A simple 4-part prompt formula that works every time.",
    category: "ai",
    tags: ["ai", "chatgpt", "prompts"],
    author: "ai-tech-desk",
    publishedAt: "2026-07-27T10:00:00Z",
    image: {
      src: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1600&auto=format&fit=crop",
      cover: "ai",
      alt: "Digital brain neural network — writing better AI prompts",
    },
    seo: {
      title: "How to Write Better AI Prompts (With Examples)",
      description:
        "A 4-part formula for writing AI prompts that get good results: role, task, context and constraints. With before-and-after examples.",
    },
    related: ["create-strong-passwords-2fa", "install-python-first-script"],
    sources: [
      { label: "Anthropic — Prompt engineering guide", url: "https://www.anthropic.com/docs/en/build-with-claude/prompt-engineering" },
    ],
    tutorial: {
      difficulty: "beginner",
      timeMinutes: 10,
      prerequisites: [
        "An account with any AI chatbot (ChatGPT, Claude, Gemini)",
      ],
      learn: [
        "Why vague prompts give vague answers",
        "The 4-part formula: role, task, context, constraints",
        "Fix a weak prompt with a before/after example",
        "Use follow-ups instead of restarting",
      ],
    },
    content: [
      {
        type: "p",
        text: "The difference between 'the AI is useless' and 'the AI saved me an hour' is usually the prompt. Chatbots follow instructions literally — they don't read your mind — so the trick is saying exactly what you want, in a structure the model understands.",
      },
      { type: "h2", text: "The 4-part prompt formula" },
      {
        type: "list",
        ordered: true,
        items: [
          "**Role** — who is the AI pretending to be? 'You are an experienced product manager.'",
          "**Task** — the one thing you want done. 'Write a short release note.'",
          "**Context** — what it needs to know. 'The feature is dark mode for a notes app.'",
          "**Constraints** — the rules. 'Three sentences, no jargon, friendly tone.'",
        ],
      },
      { type: "h2", text: "Weak vs strong — the before and after" },
      {
        type: "p",
        text: "Compare these two prompts. Weak:",
      },
      {
        type: "code",
        lang: "text",
        text: "\"Write about our new feature.\"",
      },
      {
        type: "p",
        text: "That could produce anything. Strong:",
      },
      {
        type: "code",
        lang: "text",
        text: "\"You are a copywriter for a productivity app.\nTask: write a release note for our new dark mode feature.\nContext: the app is a notes app for busy professionals; dark mode reduces eye strain.\nConstraints: 3 sentences, no jargon, friendly tone, end with one question.\"",
      },
      {
        type: "p",
        text: "The second prompt gets a usable answer the first time. The model knows the role, the task, what matters and how the output should sound.",
      },
      { type: "h2", text: "Three habits that improve every prompt" },
      {
        type: "list",
        items: [
          "**Give it an example.** 'Output should look like this: …' beats ten sentences of description.",
          "**Use follow-ups instead of restarting.** 'Make it shorter' / 'now for beginners' refines one thread.",
          "**Ask it to show its work.** 'Explain your reasoning' is how you catch wrong answers.",
        ],
      },
      {
        type: "callout",
        tone: "warn",
        title: "The one rule that outranks everything",
        text: "Fact-check anything important. AI chatbots can be confidently wrong. Use them for drafts, structure and ideas — but verify numbers, quotes and claims yourself.",
      },
    ],
  },
  {
    slug: "transfer-photos-phone-to-pc",
    title: "How to Transfer Photos From Your Phone to Your PC",
    excerpt:
      "No cables required — three wireless ways to move photos off your phone, plus how to keep them organized once they land.",
    category: "software",
    tags: ["phone", "photos", "transfer"],
    author: "ai-tech-desk",
    publishedAt: "2026-08-09T14:00:00Z",
    status: "trending",
    trendingRank: 6,
    image: {
      src: "https://images.unsplash.com/photo-1618044733300-9472054094ee?q=80&w=1600&auto=format&fit=crop",
      cover: "software",
      alt: "Smartphone next to a laptop — transferring photos from phone to PC",
    },
    seo: {
      title: "How to Transfer Photos From Your Phone to Your PC",
      description:
        "Move photos from iPhone or Android to your PC wirelessly: Windows Phone Link, cloud drives and the cable method — plus a simple folder system.",
    },
    related: ["install-remove-software-windows", "speed-up-a-slow-windows-pc"],
    sources: [
      { label: "Microsoft — Phone Link", url: "https://support.microsoft.com/en-us/phone-link" },
    ],
    tutorial: {
      difficulty: "beginner",
      timeMinutes: 10,
      prerequisites: ["Your phone and PC on the same Wi-Fi network", "A Microsoft or Google account"],
      learn: [
        "Transfer photos with Microsoft Phone Link (Android)",
        "Sync photos through a cloud drive (iPhone and Android)",
        "Do the wired transfer when you need everything at once",
        "Organize transferred photos so you can find them later",
      ],
    },
    content: [
      {
        type: "p",
        text: "Every method below moves photos without cables, apps you don't trust, or sending them to a stranger's uploader. Pick the one that matches how often you actually do this.",
      },
      { type: "h2", text: "Option 1 — Microsoft Phone Link (best for Android)" },
      {
        type: "p",
        text: "On your PC open **Phone Link** (search it in the Start menu). On your Android phone install **Link to Windows** from the Play Store and scan the QR code. Once paired, open the Photos tab and drag any shot straight onto your desktop.",
      },
      { type: "h2", text: "Option 2 — Cloud drive (best for iPhone)" },
      {
        type: "p",
        text: "Install OneDrive or Google Drive on your phone and turn on **camera backup**. Photos upload automatically, then appear on your PC through the same app or at `onedrive.com`. This is the 'set once, done forever' option.",
      },
      {
        type: "list",
        items: [
          "Turn on camera upload **only over Wi-Fi** to avoid eating your mobile data.",
          "Keep it to one cloud service — syncing the same photos into two clouds is how storage fills up fast.",
        ],
      },
      { type: "h2", text: "Option 3 — The USB cable (when you need everything)" },
      {
        type: "p",
        text: "Plug your phone in with the charging cable. On the phone, tap the notification that says 'Charging via USB' and switch it to **File transfer**. On Windows, your phone appears as a drive in File Explorer — copy the whole `DCIM` folder to get everything in one move.",
      },
      { type: "h2", text: "Keep them findable" },
      {
        type: "p",
        text: "Before you dump photos into a folder called 'New folder (2)', take 30 seconds to sort: `Photos/2026/August` is enough. Future-you searching for a specific holiday photo will be very grateful.",
      },
      {
        type: "callout",
        tone: "success",
        title: "The 3-2-1 backup rule",
        text: "Keep 3 copies of anything important, on 2 different types of storage, with 1 copy off-site. A phone full of irreplaceable photos on only one device is a single drop away from gone.",
      },
    ],
  },
  {
    slug: "use-the-terminal-without-fear",
    title: "How to Use the Terminal Without Fear",
    excerpt:
      "The black box isn't scary once you know five commands. What the terminal is, why people use it, and the commands that handle 90% of tasks.",
    category: "coding",
    tags: ["terminal", "command line", "beginner"],
    author: "ai-tech-desk",
    publishedAt: "2026-08-08T11:30:00Z",
    status: "trending",
    trendingRank: 7,
    image: {
      src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1600&auto=format&fit=crop",
      cover: "coding",
      alt: "Code on a glowing screen — using the terminal without fear",
    },
    seo: {
      title: "How to Use the Terminal Without Fear",
      description:
        "Learn the terminal with 5 essential commands: pwd, ls, cd, mkdir and cp. What they do, real examples, and how to get out of any stuck state.",
    },
    related: ["install-python-first-script", "write-better-ai-prompts"],
    sources: [
      { label: "Learn terminal basics — The Odin Project", url: "https://www.theodinproject.com/lessons/foundations-command-line-basics" },
    ],
    tutorial: {
      difficulty: "beginner",
      timeMinutes: 20,
      prerequisites: ["Windows (PowerShell or Terminal) or macOS (Terminal)"],
      learn: [
        "Understand what the terminal actually is",
        "Move around with pwd, ls and cd",
        "Create folders and copy files with mkdir and cp",
        "Escape the three most common 'stuck' moments",
      ],
    },
    content: [
      {
        type: "p",
        text: "The terminal is just a text interface to your computer — the same files and folders you see in the file explorer, with no pretty icons. You type a command, press Enter, and it happens. That's all.",
      },
      { type: "h2", text: "Your five starter commands" },
      {
        type: "table",
        columns: ["Command", "What it does"],
        rows: [
          ["pwd", "Print working directory — where am I?"],
          ["ls", "List the files and folders here"],
          ["cd <name>", "Change directory — go into a folder"],
          ["mkdir <name>", "Make a new folder"],
          ["cp <file> <copy>", "Copy a file"],
        ],
      },
      { type: "h2", text: "Step 1 — Open the terminal" },
      {
        type: "p",
        text: "On **Windows**: press **Win**, type `Terminal`, press Enter. On **macOS**: press `Cmd + Space`, type `Terminal`, press Enter. You're looking at a prompt that ends in `$` or `>` — that's just waiting for your command.",
      },
      { type: "h2", text: "Step 2 — Take a tour" },
      {
        type: "code",
        lang: "bash",
        text: "pwd\nls\nmkdir practice\ncd practice\npwd",
      },
      {
        type: "p",
        text: "You just created a folder called `practice` and stepped into it. Notice `pwd` shows a different path now — that's you moving through the file system.",
      },
      { type: "h2", text: "Step 3 — Copy something" },
      {
        type: "code",
        lang: "bash",
        text: "cd ..\nls\necho \"hello\" > hello.txt\ncp hello.txt hello-copy.txt\nls",
      },
      {
        type: "p",
        text: "You created a text file and copied it. Two files, same folder. That's the whole workflow: commands typed, Enter pressed, work done — often faster than pointing and clicking.",
      },
      { type: "h2", text: "Escaping the stuck moments" },
      {
        type: "list",
        items: [
          "**Command running forever?** Press `Ctrl + C` to stop it.",
          "**Typed the wrong thing?** `Ctrl + A` jumps to the start, `Ctrl + U` clears the line.",
          "**No idea what to type?** `help` on Windows, `man` on macOS shows what a command can do.",
        ],
      },
      {
        type: "callout",
        tone: "warn",
        title: "The golden rule",
        text: "Only ever type commands you understand. Copy-pasting random text into a terminal is how systems get broken. If a tutorial can't explain a command, don't run it.",
      },
    ],
  },
  {
    slug: "automate-repetitive-tasks-with-ai",
    title: "How to Automate Repetitive Tasks With AI",
    excerpt:
      "From email templates to renaming files — five everyday tasks you can hand off to AI today, and the prompts that make it work.",
    category: "ai",
    tags: ["ai", "automation", "productivity"],
    author: "ai-tech-desk",
    publishedAt: "2026-08-07T09:00:00Z",
    status: "trending",
    trendingRank: 8,
    image: {
      src: "https://images.unsplash.com/photo-1547082299-de196ea013d6?q=80&w=1600&auto=format&fit=crop",
      cover: "ai",
      alt: "Laptop keyboard close-up — automating repetitive tasks with AI",
    },
    seo: {
      title: "How to Automate Repetitive Tasks With AI",
      description:
        "Automate five repetitive tasks with AI: emails, summaries, file renaming, spreadsheet cleanup and meeting notes. With ready-to-use prompts.",
    },
    related: ["write-better-ai-prompts", "install-python-first-script"],
    sources: [
      { label: "Google — AI and productivity", url: "https://workspace.google.com/blog/" },
    ],
    tutorial: {
      difficulty: "beginner",
      timeMinutes: 20,
      prerequisites: ["Access to any AI chatbot (ChatGPT, Claude, Gemini)"],
      learn: [
        "Spot tasks worth automating",
        "Use AI for emails, summaries and file cleanup",
        "Write prompts that produce usable output first time",
        "Know what to keep human",
      ],
    },
    content: [
      {
        type: "p",
        text: "Automation doesn't require scripts anymore. For a huge slice of daily drudgery, a well-prompted AI does the 80% of work, and you do the final 20% check. Here are the five tasks that pay off fastest.",
      },
      { type: "h2", text: "1 — Emails that don't sound like AI" },
      {
        type: "p",
        text: "Give the AI the point, the tone and a constraint:",
      },
      {
        type: "code",
        lang: "text",
        text: "\"Draft an email to my landlord: the bathroom sink is leaking, I can host a repair visit this week, keep it friendly and short, no 'I hope this email finds you well'.\"",
      },
      { type: "h2", text: "2 — Summaries of long text" },
      {
        type: "p",
        text: "Paste an article, a contract or meeting notes and add:",
      },
      {
        type: "code",
        lang: "text",
        text: "\"Summarize this in 5 bullet points, plain English, flag anything that needs action.\"",
      },
      { type: "h2", text: "3 — Batch-rename files" },
      {
        type: "p",
        text: "AI chatbots write the scripts for you. On the side, we have a full guide to automating this with Python — but if you just want one file renamed, the prompt is:",
      },
      {
        type: "code",
        lang: "text",
        text: "\"Write a short Python script that renames all JPG files in a folder to add the date prefix, and explain how to run it.\"",
      },
      { type: "h2", text: "4 — Spreadsheet cleanup" },
      {
        type: "p",
        text: "Export your spreadsheet to CSV, paste a few messy rows, and ask: 'How do I fix these 200 rows so every name is title-cased and every email is lowercase?' The formula or script it gives you beats clicking for an hour.",
      },
      { type: "h2", text: "5 — Meeting notes" },
      {
        type: "p",
        text: "Run the transcript through: 'Turn this into actions, decisions and open questions, one line each, assigned where possible.' You walk out with a to-do list instead of a wall of text.",
      },
      {
        type: "callout",
        tone: "warn",
        title: "Keep the human in the loop",
        text: "AI is great at drafts, terrible at judgment. Never let it send money, delete files, or speak for you without reading the output. The 20% check is the whole point.",
      },
    ],
  },
  {
    slug: "keep-your-laptop-cool",
    title: "How to Keep Your Laptop Cool (and Fast)",
    excerpt:
      "A hot laptop is a slow laptop. Clean the vents, fix the settings and stop the fans from working overtime — in 15 minutes.",
    category: "hardware",
    tags: ["laptop", "cooling", "maintenance"],
    author: "ai-tech-desk",
    publishedAt: "2026-08-06T13:45:00Z",
    status: "trending",
    trendingRank: 9,
    image: {
      src: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1600&auto=format&fit=crop",
      cover: "hardware",
      alt: "Modern laptop on a desk — keeping your laptop cool and fast",
    },
    seo: {
      title: "How to Keep Your Laptop Cool (and Fast)",
      description:
        "Stop laptop overheating: clean the fans and vents, improve airflow, change power settings and monitor temperatures the safe way.",
    },
    related: ["build-a-pc-step-by-step", "speed-up-a-slow-windows-pc"],
    sources: [
      { label: "Microsoft — Manage fan and power settings", url: "https://support.microsoft.com/en-us/windows/" },
    ],
    tutorial: {
      difficulty: "beginner",
      timeMinutes: 15,
      prerequisites: ["Your laptop, a can of compressed air, 15 minutes"],
      learn: [
        "Clean the vents and fans safely",
        "Give the laptop room to breathe",
        "Fix the power settings that make it overheat",
        "Check temperatures without installing junk",
      ],
    },
    content: [
      {
        type: "p",
        text: "Laptops throttle — when they get hot, they slow down on purpose to protect themselves. So a hot laptop isn't just uncomfortable on your legs; it's measurably slower. Here's how to get the heat out.",
      },
      { type: "h2", text: "Step 1 — Clear the vents (the big one)" },
      {
        type: "p",
        text: "Turn the laptop off, find the vents (usually the thin slots on the side or rear), and blow short bursts of **compressed air** through them. Hold the fan steady with a toothpick if you can reach it. A laptop with years of dust in the vents runs measurably hotter — and slower.",
      },
      {
        type: "callout",
        tone: "warn",
        title: "Never open the case if unsure",
        text: "Blowing the vents from the outside fixes the majority of laptops. If that doesn't help, the dust may be deeper — take it to a repair shop rather than prying the bottom off and risking the internals.",
      },
      { type: "h2", text: "Step 2 — Give it air" },
      {
        type: "list",
        items: [
          "Use it on a hard surface, never on a blanket or pillow — the intake is on the bottom.",
          "A $10 laptop stand lifts it off the desk and lets air flow underneath.",
          "Keep the bottom clear of paper, cloth and your lap's blanket pile.",
        ],
      },
      { type: "h2", text: "Step 3 — Fix the settings" },
      {
        type: "p",
        text: "In **Power Settings**, set the plugged-in mode to **Balanced** (not 'Best performance', which runs the CPU hot constantly). In the background, check that nothing is chewing 100% of the CPU — Task Manager on Windows, Activity Monitor on macOS. One runaway app keeps fans screaming.",
      },
      { type: "h2", text: "Step 4 — Check the temperature" },
      {
        type: "p",
        text: "Free tools like Core Temp (Windows) or MenuMeters (macOS) show real CPU temperatures. Normal under light use is 40–60°C; under load, up to the 80s is fine. If you're idling at 90°C+, the dust is probably inside — see the shop.",
      },
      {
        type: "callout",
        tone: "success",
        title: "Order of operations",
        text: "Vents → airflow → settings → temperatures. Do these four before buying a cooling pad; most laptops only ever needed the first one.",
      },
    ],
  },
  {
    slug: "take-screenshots-windows-mac",
    title: "How to Take Screenshots on Windows and macOS",
    excerpt:
      "Every screenshot shortcut you'll ever need on both platforms — full screen, window, region and scrolling captures, without installing anything.",
    category: "windows",
    tags: ["screenshots", "shortcuts", "windows", "macos"],
    author: "ai-tech-desk",
    publishedAt: "2026-08-05T08:20:00Z",
    status: "trending",
    trendingRank: 10,
    image: {
      src: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=1600&auto=format&fit=crop",
      cover: "windows",
      alt: "Laptop keyboard with a hand — taking screenshots on Windows and macOS",
    },
    seo: {
      title: "How to Take Screenshots on Windows and macOS",
      description:
        "All screenshot shortcuts for Windows and macOS: full screen, active window, selected region, and how to find and annotate your captures.",
    },
    related: ["speed-up-a-slow-windows-pc", "transfer-photos-phone-to-pc"],
    sources: [
      { label: "Microsoft — Use Snipping Tool", url: "https://support.microsoft.com/en-us/windows/use-snipping-tool-to-capture-screenshots" },
    ],
    tutorial: {
      difficulty: "beginner",
      timeMinutes: 10,
      prerequisites: ["Any Windows 10/11 or macOS computer"],
      learn: [
        "Capture the whole screen with one shortcut",
        "Screenshot just one window or region",
        "Find, edit and share your captures",
        "Take a scrolling screenshot on both platforms",
      ],
    },
    content: [
      {
        type: "p",
        text: "Screenshots are the fastest way to ask for help, save a receipt or show someone what you see. Here's the complete map for both platforms — memorize the two shortcuts you'll use most.",
      },
      { type: "h2", text: "Windows — the essentials" },
      {
        type: "table",
        columns: ["What", "Shortcut"],
        rows: [
          ["Full screen", "Win + PrtScn"],
          ["Capture region", "Win + Shift + S"],
          ["Window (active)", "Alt + PrtScn"],
          ["Open Snipping Tool", "Win + Shift + S, then click the icon"],
        ],
      },
      {
        type: "p",
        text: "`Win + PrtScn` saves the screenshot straight to `Pictures/Screenshots`. `Win + Shift + S` opens the snip bar where you drag a box, and the capture goes to your clipboard and a notification you can click to edit.",
      },
      { type: "h2", text: "macOS — the essentials" },
      {
        type: "table",
        columns: ["What", "Shortcut"],
        rows: [
          ["Full screen", "Cmd + Shift + 3"],
          ["Capture region", "Cmd + Shift + 4"],
          ["Window (active)", "Cmd + Shift + 4, then Space, then click"],
          ["Screen recording", "Cmd + Shift + 5"],
        ],
      },
      {
        type: "p",
        text: "macOS saves captures to the desktop by default. Hold `Ctrl` with any of these to copy instead of saving. Press `Cmd + Shift + 5` to open the full capture toolbar with record, timer and options.",
      },
      { type: "h2", text: "Scrolling screenshots" },
      {
        type: "p",
        text: "Need a whole webpage? Windows **Snipping Tool** has a 'Capture scrolling window' mode. On macOS, open Safari's screenshot in the share menu — it captures the full page, not just the visible part.",
      },
      {
        type: "callout",
        tone: "info",
        title: "Screenshots are data",
        text: "A screenshot of your bank statement contains the same numbers as the original. Before sharing one, check it doesn't include card numbers, addresses or anything you don't want public.",
      },
    ],
  },
];

export const CATEGORY_FILTER_CONFIG = {
    phone: {
        title: "Điện thoại",
        description: "Khám phá các mẫu điện thoại mới nhất",
        filters: [
            {
                key: "brand",
                label: "Hãng sản xuất",
                popoverTitle: "Chọn hãng",
                type: "grid",
                options: [
                    "Samsung",
                    "Apple",
                    "Xiaomi",
                    "Oppo",
                    "Vivo",
                    "Realme"
                ]
            },
            {
                key: "price",
                label: "Khoảng giá",
                popoverTitle: "Chọn mức giá",
                type: "list",
                options: [
                    { label: "Duới 5 5 triệu", value: "0-5000000" },
                    { label: "5 - 10 triệu", value: "5000000-10000000" },
                    { label: "10 - 15 triệu", value: "10000000-15000000" },
                    { label: "15 - 20 triệu", value: "15000000-20000000" },
                    { label: "Trên 20 triệu", value: "20000000-" }
                ]
            },
            {
                key: "cpu_chip",
                label: "Chip xử lý",
                popoverTitle: "Chọn chip xử lý",
                type: "grid",
                options: [
                    "Apple A16",
                    "Apple A17 Pro",
                    "Apple A18",
                    "Snapdragon 8 Gen 2",
                    "Snapdragon 8 Gen 3",
                    "Snapdragon 7 Gen 3",
                    "MediaTek Dimensity",
                    "Exynos"
                ]
            },
            {
                key: "ram",
                label: "RAM",
                popoverTitle: "Cấu hình RAM",
                type: "grid",
                options: [
                    "4 GB",
                    "6 GB",
                    "8 GB",
                    "12 GB",
                    "16 GB"
                ]
            },
            {
                key: "storage_capacity",
                label: "Bộ nhớ trong",
                popoverTitle: "Dung lượng lưu trữ",
                type: "grid",
                options: [
                    "64 GB",
                    "128 GB",
                    "256 GB",
                    "512 GB",
                    "1 TB"
                ]
            },
            {
                key: "screen_size",
                label: "Kích thước màn hình",
                popoverTitle: "Chọn kích thước màn hình",
                type: "list",
                options: [
                    "Dưới 6 inch",
                    "6.0 - 6.4 inch",
                    "6.5 - 6.7 inch",
                    "Trên 6.7 inch"
                ]
            },
            {
                key: "screen_resolution",
                label: "Độ phân giải",
                popoverTitle: "Chọn độ phân giải màn hình",
                type: "grid",
                options: [
                    "HD+",
                    "Full HD+",
                    "1.5K",
                    "2K",
                    "Retina"
                ]
            },
            {
                key: "display_technology",
                label: "Công nghệ màn hình",
                popoverTitle: "Chọn công nghệ màn hình",
                type: "grid",
                options: [
                    "LCD",
                    "IPS LCD",
                    "OLED",
                    "AMOLED",
                    "Super AMOLED",
                    "Dynamic AMOLED",
                    "Retina"
                ]
            },
            {
                key: "rear_camera",
                label: "Camera sau",
                popoverTitle: "Độ phân giải camera sau",
                type: "grid",
                options: [
                    "12 MP",
                    "48 MP",
                    "50 MP",
                    "64 MP",
                    "108 MP",
                    "200 MP"
                ]
            },
            {
                key: "front_camera",
                label: "Camera trước",
                popoverTitle: "Độ phân giải camera trước",
                type: "grid",
                options: [
                    "8 MP",
                    "12 MP",
                    "16 MP",
                    "32 MP",
                    "50 MP"
                ]
            },
            {
                key: "battery_capacity",
                label: "Dung lượng pin",
                popoverTitle: "Chọn dung lượng pin",
                type: "list",
                options: [
                    "Dưới 4000 mAh",
                    "4000 - 4500 mAh",
                    "4500 - 5000 mAh",
                    "Trên 5000 mAh"
                ]
            },
            {
                key: "charging_power",
                label: "Sạc nhanh",
                popoverTitle: "Công suất sạc",
                type: "grid",
                options: [
                    "20 W",
                    "25 W",
                    "33 W",
                    "45 W",
                    "67 W",
                    "80 W",
                    "100 W",
                    "120 W"
                ]
            },
            {
                key: "utilities",
                label: "Tính năng",
                popoverTitle: "Tính năng đặc biệt",
                type: "list",
                options: [
                    "5G",
                    "Sạc không dây",
                    "Kháng nước & bụi",
                    "NFC",
                    "Mở khóa khuôn mặt",
                    "Vân tay dưới màn hình",
                    "2 SIM",
                    "eSIM"
                ]
            }
        ]
    },

    laptop: {
        title: "Laptop",
        description: "Lựa chọn laptop phù hợp cho học tập, làm việc, đồ họa và gaming",
        filters: [
            {
                key: "brand",
                label: "Hãng sản xuất",
                popoverTitle: "Chọn hãng laptop",
                type: "grid",
                options: [
                    "Apple",
                    "Dell",
                    "HP",
                    "Asus",
                    "Lenovo",
                    "Acer",
                    "MSI",
                    "Gigabyte",
                    "LG",
                    "Microsoft"
                ]
            },
            {
                key: "price",
                label: "Khoảng giá",
                popoverTitle: "Chọn mức giá",
                type: "list",
                options: [
                    { label: "Dưới 10 triệu", value: "0-10000000" },
                    { label: "10 - 15 triệu", value: "10000000-15000000" },
                    { label: "15 - 20 triệu", value: "15000000-20000000" },
                    { label: "20 - 25 triệu", value: "20000000-25000000" },
                    { label: "25 - 30 triệu", value: "25000000-30000000" },
                    { label: "30 - 40 triệu", value: "30000000-40000000" },
                    { label: "Trên 40 triệu", value: "40000000-" }
                ]
            },
            {
                key: "cpu_chip",
                label: "CPU",
                popoverTitle: "Chọn bộ vi xử lý",
                type: "grid",
                options: [
                    "Intel Core i3",
                    "Intel Core i5",
                    "Intel Core i7",
                    "Intel Core i9",
                    "Intel Core Ultra 5",
                    "Intel Core Ultra 7",
                    "Intel Core Ultra 9",
                    "AMD Ryzen 3",
                    "AMD Ryzen 5",
                    "AMD Ryzen 7",
                    "AMD Ryzen 9",
                    "Apple M1",
                    "Apple M2",
                    "Apple M3",
                    "Apple M4"
                ]
            },
            {
                key: "gpu_chip",
                label: "Card đồ họa",
                popoverTitle: "Chọn card đồ họa",
                type: "grid",
                options: [
                    "Intel Iris Xe",
                    "Intel Arc",
                    "AMD Radeon",
                    "Apple GPU",
                    "NVIDIA GeForce RTX 2050",
                    "NVIDIA GeForce RTX 3050",
                    "NVIDIA GeForce RTX 4050",
                    "NVIDIA GeForce RTX 4060",
                    "NVIDIA GeForce RTX 4070",
                    "NVIDIA GeForce RTX 4080",
                    "NVIDIA GeForce RTX 4090"
                ]
            },
            {
                key: "ram",
                label: "RAM",
                popoverTitle: "Dung lượng RAM",
                type: "grid",
                options: [
                    "4 GB",
                    "8 GB",
                    "12 GB",
                    "16 GB",
                    "24 GB",
                    "32 GB",
                    "64 GB"
                ]
            },
            {
                key: "storage_capacity",
                label: "Ổ cứng",
                popoverTitle: "Dung lượng lưu trữ",
                type: "grid",
                options: [
                    "128 GB SSD",
                    "256 GB SSD",
                    "512 GB SSD",
                    "1 TB SSD",
                    "2 TB SSD",
                    "SSD",
                    "HDD"
                ]
            },
            {
                key: "screen_size",
                label: "Kích thước màn hình",
                popoverTitle: "Chọn kích thước màn hình",
                type: "list",
                options: [
                    "Dưới 13 inch",
                    "13 - 14 inch",
                    "14 - 15 inch",
                    "15 - 16 inch",
                    "Trên 16 inch"
                ]
            },
            {
                key: "screen_resolution",
                label: "Độ phân giải",
                popoverTitle: "Chọn độ phân giải màn hình",
                type: "grid",
                options: [
                    "HD",
                    "Full HD",
                    "Full HD+",
                    "2K",
                    "2.5K",
                    "3K",
                    "4K",
                    "Retina",
                    "Liquid Retina",
                    "Liquid Retina XDR"
                ]
            },
            {
                key: "display_technology",
                label: "Công nghệ màn hình",
                popoverTitle: "Chọn công nghệ màn hình",
                type: "grid",
                options: [
                    "IPS",
                    "OLED",
                    "AMOLED",
                    "Mini LED",
                    "Retina",
                    "Liquid Retina",
                    "Anti-glare",
                    "Touchscreen",
                    "120Hz",
                    "144Hz",
                    "165Hz",
                    "240Hz"
                ]
            },
            {
                key: "battery_capacity",
                label: "Dung lượng pin",
                popoverTitle: "Chọn dung lượng pin",
                type: "list",
                options: [
                    "Dưới 40 Wh",
                    "40 - 50 Wh",
                    "50 - 60 Wh",
                    "60 - 70 Wh",
                    "Trên 70 Wh"
                ]
            },
            {
                key: "charging_power",
                label: "Công suất sạc",
                popoverTitle: "Chọn công suất sạc",
                type: "grid",
                options: [
                    "30 W",
                    "45 W",
                    "65 W",
                    "90 W",
                    "100 W",
                    "120 W",
                    "140 W",
                    "180 W",
                    "240 W"
                ]
            },
            {
                key: "utilities",
                label: "Nhu cầu / tính năng",
                popoverTitle: "Chọn nhu cầu sử dụng",
                type: "list",
                options: [
                    "Laptop gaming",
                    "Laptop văn phòng",
                    "Laptop đồ họa",
                    "Laptop lập trình",
                    "Laptop mỏng nhẹ",
                    "Laptop cảm ứng",
                    "Laptop 2 trong 1",
                    "Bàn phím có đèn",
                    "Vân tay",
                    "Nhận diện khuôn mặt",
                    "Wi-Fi 6",
                    "Wi-Fi 6E",
                    "Wi-Fi 7",
                    "Thunderbolt",
                    "USB-C",
                    "HDMI",
                    "Windows",
                    "macOS"
                ]
            }
        ]
    },

    tablet: {
        title: "Tablet",
        description: "Máy tính bảng phục vụ học tập, làm việc, giải trí và sáng tạo",
        filters: [
            {
                key: "brand",
                label: "Hãng sản xuất",
                popoverTitle: "Chọn hãng tablet",
                type: "grid",
                options: [
                    "Apple",
                    "Samsung",
                    "Xiaomi",
                    "Lenovo",
                    "Huawei",
                    "Oppo",
                    "Honor",
                    "Microsoft"
                ]
            },
            {
                key: "price",
                label: "Khoảng giá",
                popoverTitle: "Chọn mức giá",
                type: "list",
                options: [
                    { label: "Dưới 3 triệu", value: "0-3000000" },
                    { label: "3 - 5 triệu", value: "3000000-5000000" },
                    { label: "5 - 8 triệu", value: "5000000-8000000" },
                    { label: "8 - 12 triệu", value: "8000000-12000000" },
                    { label: "12 - 20 triệu", value: "12000000-20000000" },
                    { label: "Trên 20 triệu", value: "20000000-" }
                ]
            },
            {
                key: "cpu_chip",
                label: "Chip xử lý",
                popoverTitle: "Chọn chip xử lý",
                type: "grid",
                options: [
                    "Apple A13",
                    "Apple A14",
                    "Apple A15",
                    "Apple A16",
                    "Apple M1",
                    "Apple M2",
                    "Apple M4",
                    "Snapdragon 680",
                    "Snapdragon 695",
                    "Snapdragon 7s Gen 2",
                    "Snapdragon 8 Gen 1",
                    "Snapdragon 8 Gen 2",
                    "MediaTek Helio",
                    "MediaTek Dimensity",
                    "Exynos"
                ]
            },
            {
                key: "gpu_chip",
                label: "GPU",
                popoverTitle: "Chọn chip đồ họa",
                type: "grid",
                options: [
                    "Apple GPU",
                    "Adreno",
                    "Mali",
                    "Intel UHD",
                    "Intel Iris Xe"
                ]
            },
            {
                key: "ram",
                label: "RAM",
                popoverTitle: "Dung lượng RAM",
                type: "grid",
                options: [
                    "3 GB",
                    "4 GB",
                    "6 GB",
                    "8 GB",
                    "12 GB",
                    "16 GB"
                ]
            },
            {
                key: "storage_capacity",
                label: "Bộ nhớ trong",
                popoverTitle: "Dung lượng lưu trữ",
                type: "grid",
                options: [
                    "32 GB",
                    "64 GB",
                    "128 GB",
                    "256 GB",
                    "512 GB",
                    "1 TB",
                    "2 TB"
                ]
            },
            {
                key: "screen_size",
                label: "Kích thước màn hình",
                popoverTitle: "Chọn kích thước màn hình",
                type: "list",
                options: [
                    "Dưới 8 inch",
                    "8 - 10 inch",
                    "10 - 11 inch",
                    "11 - 12 inch",
                    "Trên 12 inch"
                ]
            },
            {
                key: "screen_resolution",
                label: "Độ phân giải",
                popoverTitle: "Chọn độ phân giải màn hình",
                type: "grid",
                options: [
                    "HD",
                    "Full HD",
                    "Full HD+",
                    "2K",
                    "2.5K",
                    "3K",
                    "4K",
                    "Retina",
                    "Liquid Retina",
                    "Liquid Retina XDR"
                ]
            },
            {
                key: "display_technology",
                label: "Công nghệ màn hình",
                popoverTitle: "Chọn công nghệ màn hình",
                type: "grid",
                options: [
                    "LCD",
                    "IPS LCD",
                    "TFT LCD",
                    "OLED",
                    "AMOLED",
                    "Dynamic AMOLED",
                    "Mini LED",
                    "Retina",
                    "Liquid Retina",
                    "120Hz",
                    "144Hz"
                ]
            },
            {
                key: "rear_camera",
                label: "Camera sau",
                popoverTitle: "Độ phân giải camera sau",
                type: "grid",
                options: [
                    "8 MP",
                    "12 MP",
                    "13 MP",
                    "16 MP",
                    "50 MP"
                ]
            },
            {
                key: "front_camera",
                label: "Camera trước",
                popoverTitle: "Độ phân giải camera trước",
                type: "grid",
                options: [
                    "5 MP",
                    "8 MP",
                    "10 MP",
                    "12 MP",
                    "13 MP"
                ]
            },
            {
                key: "battery_capacity",
                label: "Dung lượng pin",
                popoverTitle: "Chọn dung lượng pin",
                type: "list",
                options: [
                    "Dưới 5000 mAh",
                    "5000 - 7000 mAh",
                    "7000 - 9000 mAh",
                    "9000 - 11000 mAh",
                    "Trên 11000 mAh"
                ]
            },
            {
                key: "charging_power",
                label: "Sạc nhanh",
                popoverTitle: "Chọn công suất sạc",
                type: "grid",
                options: [
                    "10 W",
                    "15 W",
                    "18 W",
                    "20 W",
                    "25 W",
                    "30 W",
                    "33 W",
                    "45 W",
                    "67 W",
                    "90 W"
                ]
            },
            {
                key: "utilities",
                label: "Tính năng",
                popoverTitle: "Tính năng đặc biệt",
                type: "list",
                options: [
                    "Hỗ trợ bút cảm ứng",
                    "Hỗ trợ bàn phím rời",
                    "Có SIM",
                    "5G",
                    "4G LTE",
                    "Wi-Fi",
                    "Wi-Fi 6",
                    "Mở khóa khuôn mặt",
                    "Vân tay",
                    "USB-C",
                    "Loa Dolby Atmos",
                    "Kháng nước & bụi",
                    "Học tập",
                    "Giải trí",
                    "Vẽ đồ họa",
                    "Làm việc văn phòng"
                ]
            }
        ]
    },

    accessory: {
        title: "Phụ kiện",
        description: "Các phụ kiện công nghệ tiện ích cho học tập, làm việc và giải trí",

        filters: [
            {
                key: "subType",
                label: "Loại phụ kiện",
                popoverTitle: "Chọn loại phụ kiện",
                type: "grid",
                options: [
                    { label: "Tai nghe", value: "headphone" },
                    { label: "Bàn phím", value: "keyboard" },
                    { label: "Loa", value: "speaker" },
                    { label: "Chuột", value: "mouse" }
                ]
            },
            {
                key: "brand",
                label: "Hãng sản xuất",
                popoverTitle: "Chọn hãng",
                type: "grid",
                options: [
                    "Apple",
                    "Samsung",
                    "Sony",
                    "JBL",
                    "Logitech",
                    "Razer",
                    "Anker",
                    "Xiaomi",
                    "Asus",
                    "MSI",
                    "Rapoo",
                    "DareU",
                    "Akko"
                ]
            },
            {
                key: "price",
                label: "Khoảng giá",
                popoverTitle: "Chọn mức giá",
                type: "list",
                options: [
                    { label: "Dưới 200 nghìn", value: "0-200000" },
                    { label: "200 - 500 nghìn", value: "200000-500000" },
                    { label: "500 nghìn - 1 triệu", value: "500000-1000000" },
                    { label: "1 - 2 triệu", value: "1000000-2000000" },
                    { label: "2 - 5 triệu", value: "2000000-5000000" },
                    { label: "Trên 5 triệu", value: "5000000-" }
                ]
            }
        ],

        subTypeFilters: {
            headphone: [
                {
                    key: "connection_type",
                    label: "Kiểu kết nối",
                    popoverTitle: "Chọn kiểu kết nối",
                    type: "grid",
                    options: [
                        "Bluetooth",
                        "Có dây",
                        "True Wireless",
                        "Wireless 2.4GHz",
                        "USB-C",
                        "Jack 3.5mm"
                    ]
                },
                {
                    key: "headphone_type",
                    label: "Kiểu tai nghe",
                    popoverTitle: "Chọn kiểu tai nghe",
                    type: "grid",
                    options: [
                        "In-ear",
                        "Earbuds",
                        "On-ear",
                        "Over-ear",
                        "Chụp tai"
                    ]
                },
                {
                    key: "battery_life",
                    label: "Thời lượng pin",
                    popoverTitle: "Chọn thời lượng pin",
                    type: "list",
                    options: [
                        { label: "Dưới 5 giờ", value: "0-5" },
                        { label: "5 - 10 giờ", value: "5-10" },
                        { label: "10 - 20 giờ", value: "10-20" },
                        { label: "20 - 40 giờ", value: "20-40" },
                        { label: "Trên 40 giờ", value: "40-" }
                    ]
                },
                {
                    key: "utilities",
                    label: "Tính năng",
                    popoverTitle: "Chọn tính năng tai nghe",
                    type: "list",
                    options: [
                        "Chống ồn chủ động",
                        "Chống ồn cuộc gọi",
                        "Có micro",
                        "Gaming",
                        "Chống nước",
                        "Âm thanh Hi-Res",
                        "Spatial Audio",
                        "Sạc nhanh",
                        "Độ trễ thấp"
                    ]
                }
            ],

            keyboard: [
                {
                    key: "connection_type",
                    label: "Kiểu kết nối",
                    popoverTitle: "Chọn kiểu kết nối",
                    type: "grid",
                    options: [
                        "Có dây",
                        "Bluetooth",
                        "Wireless 2.4GHz",
                        "USB-C"
                    ]
                },
                {
                    key: "keyboard_type",
                    label: "Loại bàn phím",
                    popoverTitle: "Chọn loại bàn phím",
                    type: "grid",
                    options: [
                        "Bàn phím cơ",
                        "Bàn phím giả cơ",
                        "Bàn phím văn phòng",
                        "Bàn phím gaming",
                        "Bàn phím mini"
                    ]
                },
                {
                    key: "layout",
                    label: "Layout",
                    popoverTitle: "Chọn layout bàn phím",
                    type: "grid",
                    options: [
                        "Full-size",
                        "TKL",
                        "75%",
                        "65%",
                        "60%"
                    ]
                },
                {
                    key: "switch_type",
                    label: "Loại switch",
                    popoverTitle: "Chọn switch",
                    type: "grid",
                    options: [
                        "Blue Switch",
                        "Red Switch",
                        "Brown Switch",
                        "Linear",
                        "Tactile",
                        "Clicky"
                    ]
                },
                {
                    key: "utilities",
                    label: "Tính năng",
                    popoverTitle: "Chọn tính năng bàn phím",
                    type: "list",
                    options: [
                        "RGB",
                        "Hot-swap",
                        "Có kê tay",
                        "Chống nước",
                        "Pin sạc",
                        "Multi-device",
                        "Hỗ trợ macOS",
                        "Hỗ trợ Windows"
                    ]
                }
            ],

            speaker: [
                {
                    key: "connection_type",
                    label: "Kiểu kết nối",
                    popoverTitle: "Chọn kiểu kết nối",
                    type: "grid",
                    options: [
                        "Bluetooth",
                        "Có dây",
                        "Wi-Fi",
                        "AUX 3.5mm",
                        "USB-C"
                    ]
                },
                {
                    key: "speaker_type",
                    label: "Loại loa",
                    popoverTitle: "Chọn loại loa",
                    type: "grid",
                    options: [
                        "Loa Bluetooth",
                        "Loa vi tính",
                        "Loa soundbar",
                        "Loa mini",
                        "Loa gaming"
                    ]
                },
                {
                    key: "power",
                    label: "Công suất",
                    popoverTitle: "Chọn công suất loa",
                    type: "list",
                    options: [
                        { label: "Dưới 5 W", value: "0-5" },
                        { label: "5 - 10 W", value: "5-10" },
                        { label: "10 - 20 W", value: "10-20" },
                        { label: "20 - 50 W", value: "20-50" },
                        { label: "Trên 50 W", value: "50-" }
                    ]
                },
                {
                    key: "battery_life",
                    label: "Thời lượng pin",
                    popoverTitle: "Chọn thời lượng pin",
                    type: "list",
                    options: [
                        { label: "Dưới 5 giờ", value: "0-5" },
                        { label: "5 - 10 giờ", value: "5-10" },
                        { label: "10 - 20 giờ", value: "10-20" },
                        { label: "Trên 20 giờ", value: "20-" }
                    ]
                },
                {
                    key: "utilities",
                    label: "Tính năng",
                    popoverTitle: "Chọn tính năng loa",
                    type: "list",
                    options: [
                        "Chống nước",
                        "Có micro",
                        "Âm thanh stereo",
                        "Bass mạnh",
                        "Đèn LED",
                        "Pin sạc",
                        "Ghép đôi 2 loa",
                        "Dùng ngoài trời"
                    ]
                }
            ],

            mouse: [
                {
                    key: "connection_type",
                    label: "Kiểu kết nối",
                    popoverTitle: "Chọn kiểu kết nối",
                    type: "grid",
                    options: [
                        "Có dây",
                        "Bluetooth",
                        "Wireless 2.4GHz",
                        "USB-C"
                    ]
                },
                {
                    key: "mouse_type",
                    label: "Loại chuột",
                    popoverTitle: "Chọn loại chuột",
                    type: "grid",
                    options: [
                        "Chuột gaming",
                        "Chuột văn phòng",
                        "Chuột công thái học",
                        "Chuột mini",
                        "Chuột silent"
                    ]
                },
                {
                    key: "dpi",
                    label: "Độ nhạy DPI",
                    popoverTitle: "Chọn DPI",
                    type: "list",
                    options: [
                        { label: "Dưới 1000 DPI", value: "0-1000" },
                        { label: "1000 - 4000 DPI", value: "1000-4000" },
                        { label: "4000 - 8000 DPI", value: "4000-8000" },
                        { label: "8000 - 16000 DPI", value: "8000-16000" },
                        { label: "Trên 16000 DPI", value: "16000-" }
                    ]
                },
                {
                    key: "utilities",
                    label: "Tính năng",
                    popoverTitle: "Chọn tính năng chuột",
                    type: "list",
                    options: [
                        "RGB",
                        "Nút macro",
                        "Silent click",
                        "Công thái học",
                        "Pin sạc",
                        "Siêu nhẹ",
                        "Gaming",
                        "Multi-device"
                    ]
                }
            ]
        }
    }
};


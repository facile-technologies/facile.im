class DeviceService {
  static getDevices() {
    return [
      // 🔵 BUSINESS
      { id: "sc", title: "Sticker Custom", image: "sc.jpg", profile_type: "BUSINESS" },
      { id: "c", title: "Card", image: "cc.jpg", profile_type: "BUSINESS" },
      { id: "cc", title: "Card Custom", image: "cc.jpg", profile_type: "BUSINESS" },
      { id: "t", title: "Table", image: "tc.jpg", profile_type: "BUSINESS" },
      { id: "tc", title: "Table Custom", image: "tc.jpg", profile_type: "BUSINESS" },
      { id: "mc", title: "Metal Card", image: "mc.jpg", profile_type: "BUSINESS" },
      { id: "bc", title: "Bamboo Card", image: "bc.jpg", profile_type: "BUSINESS" },
      { id: "td", title: "Table Display", image: "td.jpg", profile_type: "BUSINESS" },

      // 🐶 PET
      { id: "p", title: "Pet Tag", image: "p.jpg", profile_type: "PET" },
      { id: "pc", title: "Pet Tag Custom", image: "p.jpg", profile_type: "PET" },
      { id: "dt", title: "Dog Tag", image: "p.jpg", profile_type: "PET" },
      { id: "19", title: "Dog Tag - Black", image: "p.jpg", profile_type: "PET" },
      { id: "20", title: "Dog Tag - Blue", image: "p.jpg", profile_type: "PET" },
      { id: "21", title: "Dog Tag - Pink", image: "p.jpg", profile_type: "PET" },

      // 🆘 SOS
      { id: "s", title: "Sticker", image: "sc.jpg", profile_type: "SOS" },
      { id: "k", title: "Keychain", image: "k.jpg", profile_type: "SOS" },
      { id: "kc", title: "Keychain Custom", image: "kc.jpg", profile_type: "SOS" },
      { id: "wb", title: "Wristband", image: "wb.jpg", profile_type: "SOS" },
      { id: "sb", title: "SOS Band", image: "sb.jpg", profile_type: "SOS" },
      { id: "ss", title: "SOS Sticker", image: "ss.jpg", profile_type: "SOS" },
      { id: "ssc", title: "SOS Card", image: "ssc.jpg", profile_type: "SOS" },
      { id: "sbk", title: "SOS Band Kids", image: "sbk.jpg", profile_type: "SOS" },
      { id: "sbj", title: "SOS Band Junior", image: "sbj.jpg", profile_type: "SOS" },
      { id: "sbb", title: "SOS Band Baby", image: "sbj.jpg", profile_type: "SOS" },
      { id: "sk", title: "SOS Keychain", image: "sk.jpg", profile_type: "SOS" },
      { id: "ss33", title: "SOS Sticker 3x3", image: "ss33.jpg", profile_type: "SOS" },
      { id: "ss35", title: "SOS Sticker 3x5", image: "ss35.jpg", profile_type: "SOS" },

      // 🆘 Color / SKU variants
      { id: "01", title: "SOS Band Baby - Black", image: "sbj.jpg", profile_type: "SOS" },
      { id: "02", title: "SOS Band Baby - Blue", image: "sbj.jpg", profile_type: "SOS" },
      { id: "03", title: "SOS Band Baby - Pink", image: "sbj.jpg", profile_type: "SOS" },
      { id: "04", title: "SOS Band Kids - Black", image: "sbk.jpg", profile_type: "SOS" },
      { id: "05", title: "SOS Band Kids - Blue", image: "sbk.jpg", profile_type: "SOS" },
      { id: "06", title: "SOS Band Kids - Pink", image: "sbk.jpg", profile_type: "SOS" },
      { id: "07", title: "SOS Band Junior - Black", image: "sbj.jpg", profile_type: "SOS" },
      { id: "08", title: "SOS Band Junior - Blue", image: "sbj.jpg", profile_type: "SOS" },
      { id: "09", title: "SOS Band Junior - Pink", image: "sbj.jpg", profile_type: "SOS" },
      { id: "10", title: "SOS Band - Black", image: "sb.jpg", profile_type: "SOS" },
      { id: "11", title: "SOS Band - Blue", image: "sb.jpg", profile_type: "SOS" },
      { id: "12", title: "SOS Band - Pink", image: "sb.jpg", profile_type: "SOS" },
      { id: "13", title: "SOS Card - Red", image: "ssc.jpg", profile_type: "SOS" },
      { id: "14", title: "SOS Keychain - Red", image: "sk.jpg", profile_type: "SOS" },
      { id: "15", title: "SOS Sticker 3x3 Hard", image: "ss33.jpg", profile_type: "SOS" },
      { id: "16", title: "SOS Sticker 3x5 Hard", image: "ss35.jpg", profile_type: "SOS" },
      { id: "17", title: "SOS Sticker 3x3 Flex", image: "ss33.jpg", profile_type: "SOS" },
      { id: "18", title: "SOS Sticker 3x5 Flex", image: "ss35.jpg", profile_type: "SOS" },
    ];
  }
}

export default DeviceService;

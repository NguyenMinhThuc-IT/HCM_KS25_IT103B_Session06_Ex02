// 1. BIEN TRANG THAI TOAN CUC DUY TRI QUA CAC VONG LAP
let registeredMembers = 0;
let totalRevenue = 0;
let checkInCount = 0;

// Biến lưu trữ thông tin hội viên vừa đăng ký gần nhất
let currentMemberName = "";
let currentPackageType = "";
let currentDurationMonths = 0;
let currentPtSessions = 0;
let isRegistered = false;

// 2. GIẢ LẬP KỊCH BẢN KỂU TƯƠNG TÁC CHƯƠNG TRÌNH (TEST CASES)
const testInputQueue = [
  // Chức năng 2 khi chưa đăng ký (Phải chặn)
  { choice: 2 },
  
  // Chức năng 1: Đăng ký hội viên mới
  { 
    choice: 1, 
    rawName: "  nguyen van a  ", 
    packageType: "vip", 
    months: 12, 
    ptSessions: 5 
  },
  
  // Chức năng 2: Tính tiền gói tập cho hội viên vừa đăng ký
  { choice: 2 },
  
  // Chức năng 3: Quét mã thẻ check-in
  { choice: 3, cardCode: "  gym-vip-2026  " }, // Mã đúng
  { choice: 3, cardCode: "INVALID-CARD" },     // Mã sai định dạng
  
  // Chức năng 4: Xuất báo cáo ca trực và thoát
  { choice: 4 }
];

let inputIndex = 0;

function getNextUserAction() {
  if (inputIndex < testInputQueue.length) {
    return testInputQueue[inputIndex++];
  }
  return { choice: 4 };
}

// 3. VÒNG LẶP DO-WHILE VÀ CẤU TRÚC SWITCH-CASE DIEU KHIEN
let isRunning = true;

do {
  const action = getNextUserAction();
  const choice = action.choice;

  switch (choice) {
    case 1: {
      console.log("\n================================================");
      console.log("[CHUC NANG 1] DANG KY VA CHUAN HOA HO SO HOI VIEN");
      console.log("================================================");

      const rawName = action.rawName || "";
      const pkg = (action.packageType || "").trim().toUpperCase();
      const months = Number(action.months) || 0;
      const pt = Number(action.ptSessions) || 0;

      // Chuẩn hóa tên hội viên: trim và viết hoa toàn bộ
      const cleanedName = rawName.trim().toUpperCase();

      // Kiểm tra tính hợp lệ của dữ liệu đầu vào
      if (cleanedName.length === 0) {
        console.log("LOI: Ten hoi vien khong duoc de rong.");
        break;
      }

      if (pkg !== "STANDARD" && pkg !== "VIP") {
        console.log("LOI: Goi tap phai la 'STANDARD' hoac 'VIP'.");
        break;
      }

      if (months <= 0) {
        console.log("LOI: So thang dang ky phai lon hon 0.");
        break;
      }

      // Cập nhật trạng thái hội viên hiện tại
      currentMemberName = cleanedName;
      currentPackageType = pkg;
      currentDurationMonths = months;
      currentPtSessions = pt;
      isRegistered = true;
      registeredMembers++;

      console.log(`Dang ky thanh cong hoi vien: ${currentMemberName}`);
      console.log(`- Goi tap: ${currentPackageType}`);
      console.log(`- Thoi han: ${currentDurationMonths} thang`);
      console.log(`- So buoi PT: ${currentPtSessions} buoi`);
      break;
    }

    case 2: {
      console.log("\n================================================");
      console.log("[CHUC NANG 2] TINH TIEN GOI TAP VA CHIET KHAU");
      console.log("================================================");

      // Ngăn chặn tính tiền nếu chưa thực hiện đăng ký ở Chức năng 1
      if (!isRegistered) {
        console.log("LOI: Chua co thong tin hoi vien moi quan ly.");
        console.log("Vui long thuc hien Chuc nang 1 (Dang ky) truoc khi tính tien.");
        break;
      }

      // Xử lý đơn giá gói tập
      let monthlyRate = 0;
      if (currentPackageType === "STANDARD") {
        monthlyRate = 500000;
      } else if (currentPackageType === "VIP") {
        monthlyRate = 800000;
      }

      const rawPackageCost = monthlyRate * currentDurationMonths;
      const ptCost = currentPtSessions * 300000;

      // Xử lý chiết khấu theo thời gian đăng ký
      let discountRate = 0;
      if (currentDurationMonths >= 12) {
        discountRate = 0.25;
      } else if (currentDurationMonths >= 6) {
        discountRate = 0.15;
      }

      const discountAmount = rawPackageCost * discountRate;
      const finalPackageCost = rawPackageCost - discountAmount;
      const totalCost = finalPackageCost + ptCost;

      // Cộng dồn vào tổng doanh thu ca trực
      totalRevenue += totalCost;

      // In hóa đơn dạng bảng ngay ngắn
      const borderLine = "-".repeat(45);
      console.log(borderLine);
      console.log("        BIEN LAI THANH TOAN GOI TAP       ");
      console.log(borderLine);
      console.log(` Hoi vien    : ${currentMemberName}`);
      console.log(` Goi tap     : ${currentPackageType}`);
      console.log(` Thoi gian   : ${currentDurationMonths} thang`);
      console.log(` So buoi PT  : ${currentPtSessions} buoi`);
      console.log(borderLine);
      console.log(` Tien goi    :${rawPackageCost.toLocaleString("en-US").padStart(18)} VND`);
      console.log(` Chiet khau  :-${discountAmount.toLocaleString("en-US").padStart(18)} VND`);
      console.log(` Tien PT     :${ptCost.toLocaleString("en-US").padStart(18)} VND`);
      console.log(borderLine);
      console.log(` TONG TIEN   :${totalCost.toLocaleString("en-US").padStart(18)} VND`);
      console.log(borderLine);

      // Reset trạng thái chờ đăng ký sau khi đã tính tiền xong
      isRegistered = false;
      break;
    }

    case 3: {
      console.log("\n================================================");
      console.log("[CHUC NANG 3] QUET MA THE CHECK-IN TAI CUA QUAY");
      console.log("================================================");

      const rawCardCode = action.cardCode || "";
      const cleanedCardCode = rawCardCode.trim().toUpperCase();
      const currentYear = new Date().getFullYear().toString();

      console.log(`Ma the quet: "${cleanedCardCode}"`);

      // Quy tắc mã thẻ: Bắt đầu bằng "GYM-" và kết thúc bằng năm hiện tại
      const hasValidPrefix = cleanedCardCode.startsWith("GYM-");
      const hasValidSuffix = cleanedCardCode.endsWith(currentYear);

      if (hasValidPrefix && hasValidSuffix && cleanedCardCode.length >= 10) {
        checkInCount++;
        console.log("XAC NHAN: Ma the hop le. Mo cua quay cho hoi vien!");
        console.log(`Luot check-in thu ${checkInCount} trong ca.`);
      } else {
        console.log("LOI: Ma the khong hop le hoac da het han.");
        console.log(`Yeu cau quy tac: Bat dau bang 'GYM-' va ket thuc bang '${currentYear}'.`);
      }
      break;
    }

    case 4: {
      console.log("\n================================================");
      console.log("[CHUC NANG 4] XUAT BẢO CÁO THONG KE CA TRUC VA THOAT");
      console.log("================================================");

      const borderLine = "=".repeat(45);
      console.log(borderLine);
      console.log("       BAO CAO TONG KET CA TRUC LE TAN      ");
      console.log(borderLine);
      console.log(` So hoi vien moi dang ky : ${registeredMembers.toString().padStart(10)} nguoi`);
      console.log(` Tong luot check-in      : ${checkInCount.toString().padStart(10)} luot`);
      console.log(borderLine);
      console.log(` TONG DOANH THU CA TRUC :${totalRevenue.toLocaleString("en-US").padStart(14)} VND`);
      console.log(borderLine);
      console.log("He thong da ghi nhận dữ liệu. Dang thoat...");

      isRunning = false;
      break;
    }

    default: {
      console.log("\nLUA CHON KHONG HOP LE!");
      console.log("Vui long chon mot trong cac chuc nang: 1, 2, 3 hoac 4.");
      break;
    }
  }
} while (isRunning);
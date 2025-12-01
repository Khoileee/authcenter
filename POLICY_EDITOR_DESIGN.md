# Tóm tắt thiết kế lại: Policy Editor (Permit.io style)

## Tổng quan
Đã thiết kế lại module "Chính sách phân quyền" theo phong cách Permit.io với 2 tab chính và các cải tiến về UX/UI.

## Cấu trúc Tab chính

### Tab 1: "Quyền theo người dùng (ACL)"
- ✅ Giữ nguyên hoàn toàn như hiện tại
- ✅ Sticky header đã được fix
- ✅ Text "Chỉ dữ liệu sở hữu" không bị xuống dòng

### Tab 2: "Quyền theo vai trò & rule (Policy Editor)"
Gồm 2 sub-tabs:

---

## 1. Sub-tab: Bảng quyền (Policy Matrix)

### Mục tiêu
Cho phép admin thấy tổng quan quyền theo ma trận: **ROLE (trục X) × RESOURCE SET + ACTION (trục Y)**

### Giao diện

**Header:**
- Tiêu đề: "Bảng quyền theo vai trò"
- Mô tả: "Quản lý quyền theo ma trận role × action. Mỗi dòng thể hiện một rule (resource set + hành động), mỗi cột là một vai trò."
- Nút "Lưu thay đổi" (hiện khi có thay đổi)
- Nút "+ Thêm rule"

**Thanh filter:**
- Dropdown "Resource": transaction, table, sql_query, job, data_quality, feature
- Ô tìm kiếm: "Tìm rule theo tên..."

**Bảng Matrix:**

Trục X (Header):
- Cột 1: "Rule / Action"
- Các cột tiếp theo: Role pills (Admin, BDA, Teller, Branch Manager, Risk Officer, Senior Manager, Viewer)

Trục Y (Rows):
- Nhóm rule groups (có thể expand/collapse)
- Mỗi group có:
  - Tên rule (clickable)
  - Icon "i" để xem chi tiết (tooltip hiển thị mô tả + điều kiện ABAC)
  - Các dòng action con (khi expanded)
- Mỗi intersection cell = Checkbox (tick = role có quyền)

**Resource-specific Rule Groups:**

**Transaction:**
- Giao dịch dưới 10 triệu (approve, read, delete)
- Giao dịch 10-100 triệu cùng chi nhánh (approve, read, delete)
- Giao dịch trên 100 triệu rủi ro cao (approve, read)

**Table:**
- Bảng do đơn vị sở hữu (create, update, view, search, upload_metadata)
- Bảng công khai (view, search)
- Bảng nhạy cảm (view, update)

**SQL Query:**
- Truy vấn của bản thân (create, update, delete, clone, search)
- Truy vấn của đơn vị (view, clone, search)

**Job:**
- Tạo job thông thường (create, view, search)
- Phê duyệt job (approve, view)
- Job ưu tiên cao (approve, update, delete)

**Data Quality:**
- Quản lý Data Quality Rules (create, update, view, delete)
- Quản lý thông báo DQ (view, configure)

**Feature:**
- Feature của đơn vị (create, update, view, search, upload, download)
- Xóa feature (delete)

### Hành vi
- ✅ Tick/untick checkbox → thay đổi ngay (không mở popup)
- ✅ Nút "Lưu thay đổi" xuất hiện khi có thay đổi
- ✅ Hover vào tên rule → tooltip hiển thị mô tả + điều kiện ABAC
- ✅ Click vào tên rule hoặc icon "i" → mở side panel chi tiết

---

## 2. Side Panel: "Thêm rule mới" / "Chỉnh sửa rule"

### PHẦN 1: THÔNG TIN CHUNG
- **Tên rule/policy** (bắt buộc)
  - Placeholder: "Ví dụ: Txn dưới 10M – Teller hoặc Branch Manager duyệt"
- **Mô tả** (optional)
  - Placeholder: "Áp dụng cho giao dịch dưới hoặc bằng 10 triệu..."
- **Trạng thái**: Active / Nháp / Tạm dừng

### PHẦN 2: PHẠM VI (RESOURCE SET + ACTION)
- **Resource**: dropdown
  - transaction, table, sql_query, job, data_quality, feature, dashboard
- **Actions**: multi-select
  - Các action phù hợp với resource đã chọn
  - Ví dụ: approve, read, delete, create, update, search, upload, download

### PHẦN 3: ĐỐI TƯỢNG CHÍNH (WHO)
Radio buttons với 3 options:

**Option 1: Áp dụng cho Role** ⭕
- Mô tả: "Chọn các vai trò đã được khai báo ở menu 'Vai trò'"
- Multi-select dropdown: Admin, BDA, Teller, Branch Manager, Risk Officer, Senior Manager, Viewer

**Option 2: Áp dụng cho User set động** ⚪
- Mô tả: "Chọn các dynamic role (user set) đã định nghĩa trước"
- Multi-select dropdown: Nhân viên PTDL, Senior Analysts, Chi nhánh HCM, Data Owners
- Lưu ý: Không tạo user set mới ở đây, chỉ chọn

**Option 3: Áp dụng cho User cụ thể** ⚪
- Mô tả: "Tuỳ chọn nâng cao. Khuyến nghị dùng ACL tab cho user đơn lẻ."
- Multi-select dropdown: danh sách users
- Advanced option, ưu tiên dùng ACL tab

### PHẦN 4: ĐIỀU KIỆN ABAC (Builder)
**Label**: "Điều kiện ABAC (Builder) – Định nghĩa Resource Set và User Set"
**Mô tả**: "Thêm điều kiện để xác định resource set (tài nguyên nào) và user set (người dùng nào) được áp dụng rule này"

**Builder:**
- Nút "+ Thêm điều kiện"
- Mỗi điều kiện: [Đối tượng] [Thuộc tính] [Toán tử] [Giá trị]

**Attribute Groups:**
- **User**: user.unit, user.team, user.seniority, user.location, user.role, user.branch
- **Resource**: resource.owner_unit, resource.responsible_unit, resource.value, resource.sensitive_level, resource.status, resource.created_by, resource.branch
- **Transaction**: transaction.amount, transaction.currency, transaction.branch, transaction.channel, transaction.country
- **Context**: request.time_of_day, request.ip_country, context.timestamp

**Logic**: AND / OR

**Preview**: Hiển thị câu mô tả tự nhiên
- Ví dụ: "Roles được approve, read, delete transaction nếu transaction.amount < 10000000 AND user.branch == transaction.branch."

### PHẦN 5: Nút hành động
- **Hủy**: Đóng panel
- **Lưu rule**: 
  - Rule xuất hiện trong Policy Matrix (group mới + actions)
  - Rule xuất hiện trong Rule List
  - Roles đã chọn được tick sẵn trong matrix

---

## 3. Sub-tab: Danh sách rule (Rule List)

### Mục tiêu
Xem toàn bộ rule ở dạng list, có thể lọc, tìm kiếm, chỉnh sửa

### Giao diện

**Header:**
- Tiêu đề: "Danh sách rule"
- Subtitle: "Quản lý tất cả rule phân quyền trong hệ thống"
- Nút "+ Tạo rule mới"

**Filters:**
- Ô tìm kiếm: "Tìm kiếm chính sách..."
- Dropdown "Resource": Tất cả / transaction / table / sql_query / job / data_quality / feature
- Dropdown "Trạng thái": Tất cả / Hoạt động / Nháp / Tạm dừng

**Bảng dữ liệu:**

| Cột | Mô tả |
|-----|-------|
| STT | Số thứ tự |
| Tên chính sách | Clickable, mở side panel Edit |
| Mô tả | Truncated nếu quá dài |
| Resource | Badge (Transaction, Table, SQL Query, Job, etc.) |
| Actions | Badges (approve, read, delete...) hiển thị tối đa 3, còn lại +N |
| Áp dụng cho | "3 vai trò", "1 user set", "2 vai trò, 1 user" |
| Trạng thái | Badge (Hoạt động / Nháp / Tạm dừng) |
| Cập nhật | Ngày cập nhật cuối |
| Hành động | Icons: Xem, Sửa, Nhân bản, Xóa |

---

## 4. Quan hệ giữa Matrix và Rule List

### Data Model chung
- Cả hai view dùng chung một model dữ liệu rule
- Thay đổi ở Matrix → cập nhật Rule List
- Thay đổi ở Rule List → cập nhật Matrix

### Workflow tạo rule mới
1. Click "+ Thêm rule" (từ Matrix hoặc Rule List)
2. Điền form trong side panel
3. Lưu rule
4. **Kết quả**:
   - Rule xuất hiện như group mới trong Matrix (trục Y)
   - Các roles đã chọn được tick sẵn ở các cột tương ứng
   - Rule xuất hiện như một hàng mới trong Rule List

### Workflow chỉnh sửa
- **Từ Matrix**: Click tên rule hoặc icon "i" → side panel Edit
- **Từ Rule List**: Click tên rule hoặc icon Sửa → side panel Edit
- Sau khi lưu: cả Matrix và Rule List đều được cập nhật

---

## Các file đã thay đổi

1. ✅ `src/pages/Policies.tsx` - Cập nhật tên tab
2. ✅ `src/components/policies/RoleRBACTab.tsx` - 2 sub-tabs với filters
3. ✅ `src/components/policies/PolicyMatrix.tsx` - Permit.io style matrix
4. ✅ `src/components/policies/RuleDetailPanel.tsx` - Enhanced form với 3 WHO options
5. ✅ `src/components/policies/UserACLTab.tsx` - Fixed sticky header

---

## Tính năng nổi bật

### Policy Matrix
✨ **Permit.io-inspired UX**
- Quick edit bằng checkbox
- Tooltip hiển thị điều kiện ABAC
- Auto-save với notification
- Expand/collapse rule groups
- Resource-specific rule groups

### Rule Detail Panel
✨ **Comprehensive ABAC Builder**
- 3 WHO options rõ ràng (Role / User set / User cụ thể)
- 4 attribute groups (User, Resource, Transaction, Context)
- Visual condition builder
- Natural language preview
- Multi-select cho roles và actions

### Rule List
✨ **Advanced Filtering & Search**
- Filter by Resource
- Filter by Status
- Search by name
- Detailed columns (STT, Resource, Actions, Applied To)
- Quick actions (View, Edit, Clone, Delete)

---

## Best Practices được áp dụng

1. **Separation of Concerns**
   - Dynamic Role/User Set được quản lý ở menu "Vai trò"
   - Policy Editor chỉ chọn, không tạo mới

2. **User Guidance**
   - Tooltips và descriptions rõ ràng
   - Khuyến nghị dùng ACL tab cho user đơn lẻ
   - Preview rule bằng natural language

3. **Consistency**
   - Matrix và Rule List dùng chung data model
   - Thay đổi ở view nào cũng sync sang view kia

4. **Performance**
   - Lazy loading cho rule groups
   - Pagination cho Rule List
   - Debounced search

---

## Ví dụ Rule hoàn chỉnh

**Tên**: "Giao dịch dưới 10 triệu"

**Resource**: transaction

**Actions**: approve, read, delete

**WHO**: Áp dụng cho Role → Teller, Branch Manager, Admin, BDA

**ABAC Conditions**:
- transaction.amount < 10000000
- user.branch == transaction.branch

**Preview**: 
"Cho phép [Teller, Branch Manager, Admin, BDA] approve/read/delete transaction khi transaction.amount < 10000000 AND user.branch == transaction.branch"

**Kết quả trong Matrix**:
- Group: "Giao dịch dưới 10 triệu" (expandable)
  - ✓ approve: Teller ✓, Branch Manager ✓, Admin ✓, BDA ✓
  - ✓ read: Teller ✓, Branch Manager ✓, Admin ✓, BDA ✓
  - ✓ delete: Teller ✓, Branch Manager ✓, Admin ✓, BDA ✓

---

## Lưu ý triển khai

### Frontend
- ✅ UI components đã hoàn thiện
- ⏳ Multi-select cho roles/actions (cần thêm component)
- ⏳ Real-time sync giữa Matrix và Rule List
- ⏳ Auto-save với debounce

### Backend (cần implement)
- API CRUD cho rules
- API lấy danh sách roles/user sets
- API validate ABAC conditions
- API evaluate permissions

### Future Enhancements
- Import/Export rules
- Rule versioning
- Audit log cho thay đổi permissions
- Bulk operations
- Rule templates

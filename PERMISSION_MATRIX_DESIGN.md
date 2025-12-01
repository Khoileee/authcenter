# Thiết kế lại: Ma trận phân quyền (Permit.io Style)

## Tổng quan
Đã thiết kế lại hoàn toàn tab "Quyền theo vai trò (RBAC & ABAC)" theo phong cách Permit.io với ma trận role × resource, không sử dụng popup mà chuyển sang side panel.

---

## Cấu trúc UI

### 1. Filter Bar (Thanh công cụ phía trên)

**Các thành phần:**
- 🔽 **Dropdown chọn loại tài nguyên**: Tất cả, transaction, table, job, feature, sql, data-quality
- 🔍 **Ô tìm kiếm**: "Tìm rule theo tên..."
- ↻ **Icon refresh**: Làm mới dữ liệu
- 💾 **Nút "Lưu thay đổi"**: Chỉ hiện khi có thay đổi

**Lưu ý:**
- ❌ Không có nút "Thêm rule" ở đây
- ✅ Nút thêm nằm trực tiếp trên ma trận

---

### 2. Ma trận phân quyền (Permission Matrix)

#### Cấu trúc bảng

**Trục X (Header - Cột ngang):**
```
| Resource/Action | Admin | BDA | Teller | Branch Manager | Risk Officer | Viewer | + Thêm nhóm người dùng |
```

- Mỗi role hiển thị dạng **pill/tag** bo tròn, màu nhạt
- Role tĩnh: Admin, BDA, Teller, Branch Manager, Risk Officer, Viewer
- Dynamic user set có label "(dynamic)"
- Cuối cùng: Nút **"+ Thêm nhóm người dùng"** (dạng border dashed)

**Trục Y (Cột dọc bên trái):**
```
▼ Quản lý bảng
    • table:create
    • table:update
    • table:search
    • table:view
    • table:upload_metadata

▼ Quản lý truy vấn SQL
    • sql:create
    • sql:search
    • sql:clone
    • sql:update

▼ Quản lý job
    • job:create
    • job:approve
    • job:search
    • job:update

▶ Data Quality
    • dq:view
    • dq:manage_rule
    • dq:manage_alert

▶ Quản lý Feature
    • feature:view
    • feature:create
    • feature:update
    • feature:delete
    • feature:upload
    • feature:download

+ Thêm tài nguyên (Resource Set)
```

- Hiển thị dạng **cây menu** (expand/collapse)
- Mỗi action hiển thị dạng `resource:action`
- Cuối cùng: Nút **"+ Thêm tài nguyên (Resource Set)"**

**Intersection Cells (Ô giao nhau):**
- ✅ **Checkbox** tại mỗi ô (role × action)
- Tick = cấp quyền (màu xanh primary)
- Untick = thu quyền (màu xám)
- Click checkbox → tự động tạo/xóa policy, không mở popup

---

### 3. Side Panel: Thêm nhóm người dùng động (User Set)

**Kích hoạt:** Click nút "+ Thêm nhóm người dùng" ở header

**Vị trí:** Mở từ bên phải (width: 460px)

**Tiêu đề:** "Tạo nhóm người dùng động (User Set)"

**Form gồm:**

1. **Tên nhóm người dùng** (required)
   - Placeholder: "Ví dụ: Nhân viên PTDL"

2. **Mô tả** (optional)
   - Textarea 3 dòng

3. **Điều kiện ABAC**
   - Builder dạng dòng với 3 cột: [Field] [Operator] [Value]
   - **Fields hỗ trợ:**
     - user.unit
     - user.role
     - user.seniority
     - user.location
     - user.employee_type
     - user.level
   - **Operators:**
     - `==`, `!=`, `contains`, `in`, `>`, `<`
   - **Logic:** AND / OR (hiển thị giữa các điều kiện)
   - Nút "+ Thêm điều kiện"
   - Icon xóa điều kiện (trash)

4. **Preview**
   - Hiển thị điều kiện dạng text:
   - Ví dụ: `user.unit == "PTDL" AND user.seniority == "senior"`

**Nút hành động:**
- Hủy
- Tạo nhóm người dùng (disabled nếu chưa nhập tên)

**Sau khi lưu:**
- Nhóm mới xuất hiện như một cột trong ma trận
- Tag có label "(dynamic)"

---

### 4. Side Panel: Thêm tài nguyên (Resource Set)

**Kích hoạt:** Click nút "+ Thêm tài nguyên (Resource Set)" ở cuối trục Y

**Vị trí:** Mở từ bên phải (width: 460px)

**Tiêu đề:** "Tạo tập tài nguyên (Resource Set)"

**Form gồm:**

1. **Tên resource set** (required)
   - Placeholder: "Ví dụ: Bảng do đơn vị sở hữu"

2. **Mô tả** (optional)
   - Textarea 3 dòng

3. **Loại Resource** (required)
   - Dropdown: table, dashboard, chart, sql query, job, feature, data-quality-rule

4. **Điều kiện ABAC cho resource**
   - Builder dạng dòng với 3 cột: [Field] [Operator] [Value]
   - **Fields hỗ trợ:**
     - resource.owner_unit
     - resource.responsible_unit
     - resource.created_by
     - resource.type
     - resource.status
     - resource.value
     - resource.tags
   - **Operators:**
     - `==`, `!=`, `contains`, `in`, `>`, `<`
   - **Logic:** AND / OR
   - Nút "+ Thêm điều kiện"
   - Icon xóa điều kiện

5. **Preview**
   - Hiển thị điều kiện dạng text:
   - Ví dụ: `resource.owner_unit == "PTDL" AND resource.status == "active"`

**Nút hành động:**
- Hủy
- Tạo tài nguyên (disabled nếu chưa nhập tên)

**Sau khi lưu:**
- Resource set xuất hiện như một nhóm mới trong trục Y
- Có thể expand/collapse
- Chứa các actions tương ứng với loại resource

---

## Workflow sử dụng

### Cấp quyền cơ bản
1. Tìm action cần cấp quyền (vd: `table:create`)
2. Tìm role cần cấp quyền (vd: `BDA`)
3. Tick checkbox tại ô giao nhau
4. Click "Lưu thay đổi"

### Tạo dynamic user set
1. Click "+ Thêm nhóm người dùng"
2. Nhập tên: "Senior Analysts"
3. Thêm điều kiện:
   - `user.seniority == "senior"`
   - `user.role == "analyst"`
4. Click "Tạo nhóm người dùng"
5. Nhóm mới xuất hiện như cột trong ma trận
6. Tick checkbox để cấp quyền cho nhóm này

### Tạo dynamic resource set
1. Click "+ Thêm tài nguyên (Resource Set)"
2. Nhập tên: "Bảng nhạy cảm"
3. Chọn loại: `table`
4. Thêm điều kiện:
   - `resource.sensitive_level == "high"`
   - `resource.owner_unit == "PTDL"`
5. Click "Tạo tài nguyên"
6. Resource set mới xuất hiện như nhóm trong trục Y
7. Expand để xem các actions
8. Tick checkbox để cấp quyền

---

## Các file đã tạo/cập nhật

### Mới tạo:
1. ✅ `src/components/policies/PermissionMatrix.tsx` - Ma trận chính
2. ✅ `src/components/policies/AddUserSetPanel.tsx` - Side panel thêm user set
3. ✅ `src/components/policies/AddResourceSetPanel.tsx` - Side panel thêm resource set

### Đã cập nhật:
4. ✅ `src/pages/Policies.tsx` - Đổi tên tab
5. ✅ `src/components/policies/RoleRBACTab.tsx` - Simplified, chỉ hiển thị matrix

### Không dùng nữa (giữ lại để tham khảo):
- `PolicyMatrix.tsx` (old)
- `RuleDetailPanel.tsx` (old)
- `DynamicGroupPanel.tsx` (old)

---

## Tính năng nổi bật

### ✨ Permit.io Style
- Ma trận role × resource trực quan
- Quick edit bằng checkbox
- Không cần popup phức tạp
- Add column/row trực tiếp trên ma trận

### 🎯 Dynamic User Set
- Định nghĩa nhóm người dùng động bằng ABAC
- Hỗ trợ 6 user attributes
- Logic AND/OR linh hoạt
- Preview điều kiện real-time

### 📦 Dynamic Resource Set
- Định nghĩa tập tài nguyên động bằng ABAC
- Hỗ trợ 7 resource attributes
- Phân loại theo resource type
- Preview điều kiện real-time

### 💾 Auto-save
- Nút "Lưu thay đổi" chỉ hiện khi có thay đổi
- Tick/untick checkbox không mở popup
- Thay đổi được track tự động

### 🔍 Filter & Search
- Filter theo loại tài nguyên
- Search theo tên rule
- Refresh data

---

## So sánh với thiết kế cũ

| Tính năng | Thiết kế cũ | Thiết kế mới (Permit.io) |
|-----------|-------------|--------------------------|
| Cấu trúc | 2 sub-tabs (Matrix + Rule List) | 1 ma trận duy nhất |
| Thêm rule | Popup "Thêm rule mới" | Side panel + checkbox |
| Thêm role | Không có | Nút "+ Thêm nhóm người dùng" |
| Thêm resource | Popup phức tạp | Nút "+ Thêm tài nguyên" |
| Edit quyền | Click checkbox trong matrix | Click checkbox trong matrix |
| Dynamic sets | Ở tab riêng | Tích hợp trong ma trận |
| UX | Nhiều bước, phức tạp | Đơn giản, trực quan |

---

## Ví dụ cụ thể

### Ví dụ 1: Cấp quyền cho role tĩnh
**Yêu cầu:** Cho phép BDA tạo bảng

**Các bước:**
1. Tìm dòng `table:create`
2. Tìm cột `BDA`
3. Tick checkbox
4. Click "Lưu thay đổi"

**Kết quả:** BDA có quyền `table:create`

---

### Ví dụ 2: Tạo dynamic user set
**Yêu cầu:** Tạo nhóm "Senior Analysts PTDL"

**Các bước:**
1. Click "+ Thêm nhóm người dùng"
2. Nhập tên: "Senior Analysts PTDL"
3. Thêm điều kiện:
   - `user.unit == "PTDL"`
   - AND
   - `user.seniority == "senior"`
   - AND
   - `user.role == "analyst"`
4. Click "Tạo nhóm người dùng"

**Kết quả:** 
- Cột mới "Senior Analysts PTDL (dynamic)" xuất hiện
- Có thể tick checkbox để cấp quyền cho nhóm này

---

### Ví dụ 3: Tạo dynamic resource set
**Yêu cầu:** Tạo tập "Bảng công khai"

**Các bước:**
1. Click "+ Thêm tài nguyên (Resource Set)"
2. Nhập tên: "Bảng công khai"
3. Chọn loại: `table`
4. Thêm điều kiện:
   - `resource.is_public == "true"`
5. Click "Tạo tài nguyên"

**Kết quả:**
- Nhóm mới "Bảng công khai" xuất hiện trong trục Y
- Expand để thấy các actions: create, update, view, search, upload_metadata
- Có thể tick checkbox để cấp quyền

---

## Best Practices

### 1. Tổ chức Resource Groups
- Nhóm theo chức năng nghiệp vụ
- Tên rõ ràng, dễ hiểu
- Expand các nhóm thường dùng

### 2. Đặt tên Dynamic Sets
- **User Set**: Mô tả nhóm người dùng (vd: "Senior Analysts PTDL")
- **Resource Set**: Mô tả tập tài nguyên (vd: "Bảng nhạy cảm")
- Tránh tên chung chung

### 3. ABAC Conditions
- Điều kiện đơn giản, dễ hiểu
- Tránh quá nhiều điều kiện (max 5)
- Sử dụng AND cho điều kiện bắt buộc
- Sử dụng OR cho điều kiện tùy chọn

### 4. Quản lý quyền
- Review quyền định kỳ
- Sử dụng dynamic sets cho nhóm lớn
- Sử dụng role tĩnh cho vai trò cố định
- Lưu thay đổi thường xuyên

---

## Roadmap

### Phase 1 (Hoàn thành) ✅
- Ma trận role × resource
- Add user set panel
- Add resource set panel
- Checkbox quick edit
- Filter & search

### Phase 2 (Tiếp theo) 🔄
- Multi-select cho actions
- Bulk operations
- Export/Import permissions
- Audit log

### Phase 3 (Tương lai) 📋
- Permission testing
- Conflict detection
- Role hierarchy
- Permission templates

# Tóm tắt thay đổi: Thiết kế lại module "Chính sách phân quyền"

## Tổng quan
Đã thiết kế lại module "Chính sách phân quyền" theo cấu trúc 2 tab chính với các cải tiến về UI/UX và chức năng.

## Các thay đổi chính

### 1. Cấu trúc Tab chính (Policies.tsx)
- **Tab 1**: "Quyền theo người dùng (ACL)" - Giữ nguyên hoàn toàn
- **Tab 2**: "Quyền theo vai trò & rule (Policy Editor)" - Đã đổi tên và cải tiến

### 2. Tab "Policy Editor" (RoleRBACTab.tsx)
**Trước đây**: 3 sub-tabs
- Ma trận RBAC
- Quyền nhóm động (ABAC)
- Danh sách rule

**Hiện tại**: 2 sub-tabs
- **Bảng quyền (Policy Matrix)**: Quản lý quyền theo ma trận role × action
- **Danh sách rule (Rule List)**: Quản lý tất cả rule phân quyền (RBAC + ABAC)

**Lý do loại bỏ tab "Quyền nhóm động (ABAC)"**:
- Tránh trùng lặp với "Danh sách rule"
- Thông tin ABAC được tích hợp vào từng rule trong danh sách
- UI gọn gàng và dễ quản lý hơn

### 3. Policy Matrix (PolicyMatrix.tsx)
**Cải tiến**:
- Hỗ trợ đa dạng resource types:
  - transaction
  - table
  - sql_query
  - job
  - feature
  - dq_rule
  - dashboard

- Mỗi resource có rule groups và actions riêng phù hợp
- Dropdown resource cho phép chuyển đổi nhanh giữa các loại resource
- Tìm kiếm rule theo tên

**Cấu trúc bảng**:
- Trục X (cột): Các vai trò (Admin, Teller, Branch Manager, Risk Officer, Senior Manager)
- Trục Y (hàng): Rule groups và actions tương ứng
- Mỗi ô: Checkbox cho phép bật/tắt quyền

### 4. Rule Detail Panel (RuleDetailPanel.tsx)
**Cải tiến**:
- Hỗ trợ tất cả resource types mới
- ABAC Condition Builder nâng cao với 4 nhóm thuộc tính:
  - **User**: user.unit, user.team, user.seniority, user.location, user.role, user.branch
  - **Resource**: resource.owner_unit, resource.responsible_unit, resource.value, resource.sensitive_level, resource.status, resource.created_by, resource.branch
  - **Transaction**: transaction.amount, transaction.currency, transaction.branch, transaction.channel, transaction.country
  - **Context**: request.time_of_day, request.ip_country, context.timestamp

**Cấu trúc panel**:
1. **Thông tin chung**:
   - Tên rule/policy (bắt buộc)
   - Mô tả
   - Trạng thái (Active/Draft)

2. **Phạm vi (Resource + Action)**:
   - Chọn resource type
   - Multi-select actions

3. **Đối tượng & điều kiện ABAC**:
   - Chọn áp dụng cho Role hoặc User cụ thể
   - ABAC Condition Builder:
     * Thêm nhiều điều kiện
     * Chọn attribute group, attribute name, operator, value
     * Logic kết hợp: AND/OR
     * Preview câu mô tả tự nhiên

### 5. User ACL Tab (UserACLTab.tsx)
**Cải tiến nhỏ**:
- Fixed sticky header cho bảng quyền ACL
- Header cố định khi scroll xuống
- Background khớp hoàn hảo với card container
- Text "Chỉ dữ liệu sở hữu" không bị xuống dòng (whitespace-nowrap)

## Lợi ích của thiết kế mới

1. **Gọn gàng hơn**: Giảm từ 3 sub-tabs xuống 2, loại bỏ sự trùng lặp
2. **Linh hoạt hơn**: Hỗ trợ nhiều loại resource khác nhau
3. **Mạnh mẽ hơn**: ABAC conditions builder với nhiều attribute groups
4. **Dễ sử dụng hơn**: UI/UX được cải thiện, sticky header, search, filter
5. **Mở rộng tốt hơn**: Dễ dàng thêm resource types và attributes mới

## Các file đã thay đổi

1. `src/pages/Policies.tsx` - Cập nhật tên tab
2. `src/components/policies/RoleRBACTab.tsx` - Giảm từ 3 xuống 2 sub-tabs
3. `src/components/policies/PolicyMatrix.tsx` - Hỗ trợ đa resource types
4. `src/components/policies/RuleDetailPanel.tsx` - Nâng cấp ABAC builder
5. `src/components/policies/UserACLTab.tsx` - Fixed sticky header

## Ghi chú

- Dynamic Role (user set) và Dynamic Resource (resource set) sẽ được quản lý ở menu "Vai trò" và "Tài nguyên"
- Trong Policy Editor chỉ chọn lại các role và resource đã tạo, không tạo mới tại đây
- File `DynamicGroupPanel.tsx` không còn được sử dụng nhưng vẫn giữ lại để tham khảo

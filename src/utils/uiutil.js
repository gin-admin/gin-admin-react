import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import PButton from '@/components/PermButton';

export const showPButtons = (
  selectedRows,
  onAddClick,
  onItemEditClick,
  onItemDelClick,
  onItemEnableClick,
  onItemDisableClick
) => [
  <PButton code="add" key="add" type="primary" icon={<PlusOutlined />} onClick={() => onAddClick()}>
    新建
  </PButton>,
  selectedRows.length === 1 && (
    <PButton key="edit" code="edit" onClick={() => onItemEditClick(selectedRows[0])}>
      编辑
    </PButton>
  ),
  selectedRows.length === 1 && (
    <PButton
      key="del"
      code="del"
      danger
      type="primary"
      onClick={() => onItemDelClick(selectedRows[0])}
    >
      删除
    </PButton>
  ),
  selectedRows.length === 1 && !selectedRows[0].is_active && (
    <PButton key="enable" code="enable" onClick={() => onItemEnableClick(selectedRows[0])}>
      启用
    </PButton>
  ),
  selectedRows.length === 1 && selectedRows[0].is_active === true && (
    <PButton
      key="disable"
      code="disable"
      danger
      onClick={() => onItemDisableClick(selectedRows[0])}
    >
      禁用
    </PButton>
  ),
];

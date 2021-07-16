import { request } from "services";

// 查询组织资源关系列表
// http://192.168.192.132:3000/project/198/interface/api/29949
// 接口对接人: zhangjiacheng
type IList = {
  orgId?: any; // 组织ID
  resourceId?: any; // 资源ID
  resourceType?: any; // 资源类型
};
export async function _list(query: IList) {
  return await request(`/api/usercenter/v1/orgResource/list`, "GET", query);
}

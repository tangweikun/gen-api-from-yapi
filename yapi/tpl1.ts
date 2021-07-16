import { request } from 'services';

// 批量查询组织资源
// http://192.168.192.132:3000/project/198/interface/api/29928
// 接口对接人: zhangjiacheng
type IBatchList = {
	orgIds: any; // orgIds
	type: any; // type
}
export async function _batchList(query: IBatchList) {
  return request(`/api/usercenter/v1/orgResource/batchList`, "GET", query);
}

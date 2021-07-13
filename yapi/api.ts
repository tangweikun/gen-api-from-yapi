import { request } from 'services';

// 删除车辆二级维护
// http://192.168.192.132:3000/project/183/interface/api/15221
// 接口对接人: houkaifang
type IDeleteByKey = {
	
}
export async function _deleteByKey(query: IDeleteByKey) {
  return await request(`/api/jp-train-noncore-svc/v1/schCarServiceinfo/deleteByKey`, "DELETE", query);
}

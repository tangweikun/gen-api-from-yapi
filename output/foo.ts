import { request } from 'services';

// 根据主键删除数据实体对象
// http://192.168.192.132:3000/project/183/interface/api/14318
// 接口对接人: houkaifang
export async function _deleteByKey(query: { id: any }) {
  return await request(`/api/jp-train-noncore-svc/v1/schBranchNetwork/getSchoolsByNetwork`, DELETE, query);
}

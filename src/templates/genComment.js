// 生成接口相关信息
function genComment({ project_id, _id, title, username, server }) {
  const titleComment = `// ${title}`;
  const linkComment = `// ${server}/project/${project_id}/interface/api/${_id}`;
  const authorNameComment = `// 接口对接人: ${username}`;
  return `${titleComment}\n${linkComment}\n${authorNameComment}\n`;
}

module.exports = genComment;

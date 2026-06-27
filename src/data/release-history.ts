export type ReleaseInfo = {
  id: number;
  name: string | null;
  tag_name: string;
  html_url: string;
  published_at: string | null;
  body: string | null;
};

export const repositoryUrl = "https://github.com/GitHubSUHONGSHI/AGENTSU";
export const releasesUrl = `${repositoryUrl}/releases`;
export const personalSiteUrl = "https://githubsuhongshi.github.io/AGENTSU/";
export const releaseApiUrl = "https://api.github.com/repos/GitHubSUHONGSHI/AGENTSU/releases?per_page=5";

export const fallbackReleases: ReleaseInfo[] = [
  {
    id: 130,
    name: "首版PYTHON练习工程",
    tag_name: "v1.3.0",
    html_url: `${repositoryUrl}/releases/tag/v1.3.0`,
    published_at: "2026-06-27T02:33:00Z",
    body: "同步 GitHub 最新发布信息，保留课程门户、学习工作台、课程目录和本地进度记录。",
  },
  {
    id: 1,
    name: "首版 Python 学习站点",
    tag_name: "v1.0.0",
    html_url: `${repositoryUrl}/releases/tag/v1.0.0`,
    published_at: "2026-06-26T00:00:00Z",
    body: "首个版本已完成课程门户、学习工作台、课程目录和本地进度记录。",
  },
];

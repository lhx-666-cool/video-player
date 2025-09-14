class Dav {
  constructor(webdavUrl, username, password) {
    this.webdavUrl = webdavUrl;
    this.username = username;
    this.password = password;
  }

  async getDirectoryContents(directoryPath) {
    const url = this.webdavUrl + directoryPath;
    const headers = {
      "Authorization": `Basic ${btoa(`${this.username}:${this.password}`)}`,
      "Depth": "1" // 获取当前目录和一级子项
    };

    try {
      const response = await fetch(url, {
        method: "PROPFIND", // 使用PROPFIND方法
        headers: headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const xmlText = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");

      const responses = xmlDoc.querySelectorAll("response");
      const files = [];

      responses.forEach(response => {
        const href = response.querySelector("href").textContent;
        const displayName = response.querySelector("displayname").textContent || href.substring(href.lastIndexOf('/') + 1); // 提取文件名
        const isDirectoryNode = response.querySelector('collection');
        const isDirectory = isDirectoryNode !== null; // 检查节点是否存在

        // 排除当前目录本身
        if (href !== url) {
          files.push({
            href: href,
            displayName: displayName,
            isDirectory: isDirectory
          });
        }

      });

      return files;
    } catch (error) {
      console.error("WebDAV 操作失败:", error);
      throw error;
    }
  }
}
export default Dav;
# 叶佑林 · 个人简历网站

黑白灰静态简历网站，无构建步骤、无第三方图片或在线字体依赖。可以直接打开 `index.html`，或使用 Node.js 启动：

```powershell
node server.mjs
```

浏览器访问 `http://localhost:4173`。同一 Wi-Fi 下的手机可以使用本机的局域网 IP 加端口 4173 访问（以本机网络设置为准）。

## 手机阅读版 PDF

网站顶部、底部和移动端导航中的下载入口都指向：

`output/pdf/ye-youlin-mobile.pdf`

PDF 采用 390 × 844 pt 窄版单列布局，共 5 页，嵌入中文字体，文字可选择，电话和邮箱可点击。这是独立 PDF 文件，离线打开即可查看完整履历，不依赖网页展开状态或浏览器打印。

修改简历后，可使用安装了 ReportLab 的 Python 重新生成：

```powershell
python scripts/build_resume_pdf.py
```

生成脚本默认读取 Windows 微软雅黑字体。跨平台运行时，请将脚本中的字体路径替换为可嵌入的中文 TrueType 字体路径。

## 内容与交互

- `index.html`：简历正文、四段工作经历、成果数据和下载链接。
- `styles.css`：黑白灰视觉、桌面布局、动效和减少动态效果支持。
- `mobile.css`：手机/平板布局、底部导航与安全区适配。
- `script.js`：滚动进度、数字动画、数据切换、指针响应及联系方式复制。

运营需求量、交付效率分别按原始月份记录展示；CRV 保留简历原始名称和 0.4% 数值，未自行解释为百分点或改成其他指标。部署时请包含 `output/pdf` 文件夹。

## GitHub Pages 部署

网站可直接由 GitHub Pages 发布，无需构建或在线安装依赖。仓库根目录包含 `.nojekyll`，用于直接提供 HTML、CSS、JavaScript 与 PDF 文件。

在仓库的 Settings → Pages 中选择 **Deploy from a branch**，将发布分支设置为 `main`，目录选择 `/ (root)`。首次发布成功后，网站地址将显示在 Pages 设置中。后续将更新推送到该分支即可同步发布，手机 PDF 继续使用站内相对路径下载。

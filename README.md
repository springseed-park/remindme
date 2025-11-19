<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1YoFzX11uA-qQhNWmwe4mIcUGjNOJSedd

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `API_KEY` in [.env.local](.env.local) to your OpenAI API key
3. Run the app:
   `npm run dev`

## Deployment Options

### Option 1: GitHub Pages (자동 배포)
**이미 설정되어 있습니다!** main 브랜치에 머지하면 자동으로 배포됩니다.

1. **GitHub 설정**
   - Repository → Settings → Pages
   - Source: `GitHub Actions` 선택

2. **API 키 설정**
   - Repository → Settings → Secrets and variables → Actions
   - New repository secret 클릭
   - Name: `API_KEY`
   - Value: OpenAI API 키 입력
   - Add secret 클릭

3. **배포**
   - main 브랜치에 push하면 자동으로 배포됩니다
   - 배포 완료 후 URL: `https://springseed-park.github.io/remindme/`

**⚠️ 주의**: GitHub Pages는 클라이언트 사이드에서 API를 호출하므로 API 키가 노출될 수 있습니다.

### Option 2: Vercel (프로덕션 추천)
1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and sign in with GitHub
3. Import your repository
4. Add environment variable: `API_KEY` with your OpenAI API key
5. Deploy

### Option 3: Netlify
1. Push your code to GitHub
2. Go to [Netlify](https://netlify.com) and sign in with GitHub
3. Add new site from Git
4. Add environment variable: `API_KEY` with your OpenAI API key
5. Deploy

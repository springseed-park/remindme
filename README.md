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

### Option 1: Vercel (추천 - 안전함) ⭐
**API 키가 서버에 안전하게 보호됩니다!**

1. **Vercel 가입 및 배포**
   - https://vercel.com 접속
   - GitHub 계정으로 Sign Up
   - "Add New Project" 클릭
   - 이 레포지토리 Import

2. **환경변수 설정**
   - Environment Variables 섹션에서
   - Name: `API_KEY`
   - Value: OpenAI API 키 입력
   - 모든 환경 (Production, Preview, Development) 선택

3. **배포 완료!**
   - Deploy 버튼 클릭
   - 몇 분 후 배포 완료
   - Vercel이 제공하는 URL로 접속 가능

**장점:**
- ✅ API 키가 서버리스 함수에만 저장됨 (완전히 안전)
- ✅ GitHub 연동 시 자동 배포
- ✅ 무료 플랜으로 충분

### Option 2: GitHub Pages (테스트용)
**⚠️ 주의: API 키가 클라이언트에 노출됩니다!**

이 방법은 테스트용으로만 사용하세요.

1. **GitHub 설정**
   - Repository → Settings → Pages
   - Source: `GitHub Actions` 선택

2. **API 키 설정**
   - Repository → Settings → Secrets and variables → Actions
   - Name: `API_KEY`
   - Value: OpenAI API 키

3. **사용량 제한 필수!**
   - https://platform.openai.com/account/limits
   - 월 사용량 제한 설정 (예: $5)

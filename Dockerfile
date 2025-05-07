# 빌드 스테이지
FROM node:24-alpine AS build

# pnpm 설치
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# 패키지 파일 복사
COPY package.json pnpm-lock.yaml* ./

# 의존성 설치
RUN pnpm install

# 소스 파일 복사
COPY . .

# ESLint 검사를 건너뛰고 빌드 (--no-lint 옵션 추가)
RUN pnpm next build --no-lint

# 실행 스테이지
FROM node:20-alpine AS runner

# pnpm 설치
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# 환경 변수 설정
ENV NODE_ENV production

# 시스템 사용자 추가
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 빌드 결과물 복사
COPY --from=build /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

# 사용자 변경
USER nextjs

# 포트 노출
EXPOSE 3000

# 환경 변수: 호스트가 0.0.0.0이어야 컨테이너 외부에서 접근 가능
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# 실행
CMD ["node", "server.js"] 
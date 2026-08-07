FROM mcr.microsoft.com/playwright:v1.49.0-noble

WORKDIR /app

COPY package*.json ./
RUN npm install

EXPOSE 3000

ENV PORT=3000

CMD ["npx", "-y", "@playwright/mcp@latest", "--transport", "sse", "--port", "3000"]
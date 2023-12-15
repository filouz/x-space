from node

ENV NODE_OPTIONS=--openssl-legacy-provider

RUN apt update

RUN apt upgrade -y

RUN apt install -y zsh
RUN sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
RUN chsh -s /bin/zsh
RUN sed -i 's/ZSH_THEME="robbyrussell"/ZSH_THEME="ys"/g' /root/.zshrc

RUN apt install -y netcat-openbsd net-tools iputils-ping

RUN git clone --depth 1 -- https://github.com/marlonrichert/zsh-autocomplete.git /root/.oh-my-zsh/plugins/zsh-autocomplete
RUN sed -i 's/plugins=(/plugins=(zsh-autocomplete /g' /root/.zshrc


# Set the working directory
WORKDIR /app

# Copy the global package.json and yarn.lock
COPY package.json yarn.lock ./

# Copy the workspace-specific package.json
COPY packages/cmd/bridge/package.json packages/cmd/bridge/

# Install dependencies
RUN yarn install --frozen-lockfile --production

# Copy the application code
COPY packages/cmd/bridge/ packages/cmd/bridge/

# Set the working directory to the bridge microservice
WORKDIR /app/packages/cmd/bridge

# Run the app
CMD ["node", "index.js"]

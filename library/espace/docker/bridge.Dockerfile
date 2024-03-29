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


WORKDIR /app

COPY package.json yarn.lock ./

COPY packages/cmd/bridge/package.json packages/cmd/bridge/

RUN yarn workspace bridge install

COPY packages/cmd/bridge/ packages/cmd/bridge/

WORKDIR /app/packages/cmd/bridge

RUN yarn build

CMD ["yarn", "start"]

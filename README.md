# Mapas Culturais APP

Este é o repositório do aplicativo Android do sistema [Mapas Culturais](https://github.com/hacklabr/mapasculturais). Ele é orientado para funcionar como uma espécie de Agenda Cultural. Entre suas principais funcionalidades, estão:

* Apresentar uma consulta dos dados (Eventos, Espaços, Agentes, Projetos) de todas as instâncias vigentes do Mapas Culturais; 
* Permitir a seleção manual de uma determinada instalação;
* Exibir geolocalização do mapa a partir da instalação mais proxima, pela localização do gps do mobile device;


# Download e build
------------------

Se você já tem o npm instalado, basta fazer:

* Instalar o ionic globalmente
```
$ sudo npm -g install cordova ionic bower gulp
```

* Clonar o repositório
```
$ git clone https://github.com/hacklabr/mapasculturais-app.git
```

* Fazer o build padrão
```
$ cd mapasculturais-app
$ npm install
$ bower install
```

* Rodar
```
$ ionic serve
```

* Para rodar no navegador(chrominum) desabilitando a verfificação de cross-origin:
```
chromium --disable-web-security
```
E abrir o URL [http://localhost:8100](http://localhost:8100)

# Editando
----------

Na raiz do projeto você terá o diretorio scss onde ficará seu sass. só editar!
O ionic serve já faz o watch dos arquivos, recompila na alteração e faz o 
livereolad

* Resources
  * http://ionicframework.com/docs/cli/sass.html
  * http://learn.ionicframework.com/formulas/working-with-sass/
  * http://ionicframework.com/docs/components

# Rodando no celular Android ou Emulador

Para isso, você precisará ter a SDK Android instalada

* Instala o phonegap
```
$ npm install phonegap
```

* Adiciona a plataforma android ao projeto (aqui, se a SDK não estiver
instalada já haverá falha)
```
$ ionic platform add android
```

* Aqui, precisamos ter um dispositivo plugado ao computador aceitando 
instalação de fontes desconhecidas e com o modo desenvolvedor ativado.
```
$ ionic run android
```

* Para emular, é necessário que se crie um disposivo usando o Android SDK Manager
```
$ android
```

* Uma vez criado o dispositivo
```
$ ionic emulate android
```

# Configurando o serviço de Notificações no Aplicativo

Preparando o aplicativo para a comunicação com o firebase

1. Utilize uma conta google e crie um projeto no Google Cloud:
https://cloud.google.com/resource-manager/docs/creating-managing-projects#creating_a_project

Obs.: o uso do Firebase necessita da ativação de faturamento, no entanto, o Firebase disponibiliza o envio de notificações sem custo (consulte https://firebase.google.com/docs/cloud-messaging/?hl=pt-br).

2. Adicione o projeto criado ao Firebase:
https://console.firebase.google.com

Obs.: Apesar do desenvolvimento ser baseado nos recursos HTML e JS, as builds são realizadas para as plataformas Android e iOS, portanto, a configuração do firebase deve ser para as plataformas citadas.

3. Faça o download dos arquivos de configuração para Android e iOS (google-services.json e GoogleService-info.plist, respectivamente), e inclua na pasta raiz do projeto.
https://support.google.com/firebase/answer/7015592?hl=pt-br

4. Pronto, agora é possível simular o envio de mensagens para as instalações Android e/ou iOS.
https://console.firebase.google.com/project/<my-google-project-name>/notification

Ao receber uma notificação com o parâmetro: event_id, o APP fará o redirecionamento para a tela correspondente ao evento.

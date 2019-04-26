# WebSocket
This is a small and simple WebSocket client for Vue2

## Install
Install with npm:
```
npm install --save @wuild/vue-websocket
```

```javascript
const WebSocketVue = require("@wuild/vue-websocket");

Vue.use(WebSocketVue);
```

## Usage
The WebSocket methods are accessable using the $websocket variable inside vue.

#### API Example
```javascript
export default {
    created(){
        this.$websocket.connect("wss://echo.websocket.org");
    }
}
```

#### Event list
| Event name                 | Event description            |
|----------------------------|------------------------------|
| open                       | On connection open           |
| close                      | On connection close          |
| message                    | On message                   |
| error                      | On error                     |


#### Event Example
```javascript
export default {
    created(){
        this.$websocket.$on("open", function(){
            // Connection is open
        });
        this.$websocket.$on("close", function(){
            // Connection is closed
        });
        this.$websocket.$on("message", function(){
            // WebSocket message received
        });
        this.$websocket.connect("wss://echo.websocket.org");
    },
    events: {
        websocket: {
            open(){
                // WebSocket connection open
            },
            close(){
                // WebSocket connection closed
            },
            message(){
                // WebSocket message received
            }
        }
    }
}
```

#### Methods
* connect(url, options)
* disconnect()
* send(String: message)

#### Default options
```json
{
 "bodyParser": "json",
 "reconnect": {
     "enabled": true,
     "attempts": 3,
     "delay": 3000
 }
}
```


#### Full example
```vue
<template>
    <div>
        <button @click="connect()" v-if="!$websocket.connected && !$websocket.connecting && !$websocket.reconnecting">Connect</button>
        <button @click="disconnect()" v-else-if="$websocket.connected">Disconnect</button>
    </div>
</template>
<script>
    export default {
        methods: {
            connect(){
                this.$websocket.connect("wss://echo.websocket.org")
            },
            disconnect(){
                this.$websocket.disconnect()
            }
        },
        created() {
            this.$websocket.$on("open", function () {
                console.log("Websocket open", this.$websocket.options.url);
                
                this.$websocket.send("Hello World");
                
            }.bind(this));

            this.$websocket.$on("close", function (event) {
                console.warn("Websocket closed", this.$websocket.options.url);
            }.bind(this));

            this.$websocket.$on("message", function (message) {
                console.log("Message received", message)
            });
        }
    }
</script>
```

#### Component based events
```vue
<script>
// These events will be automatically removed when component is destroyed
export default {
    events: {
        websocket: {
            open(){
                // WebSocket connection open
            },
            close(){
                // WebSocket connection closed
            },
            message(){
                // WebSocket message received
            }
        }
    }
}
</script>
```

#### License
Copyright © 2018, [Wuild](https://github.com/Wuild) Released under the [MIT license](https://opensource.org/licenses/MIT).
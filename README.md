# WebSocket
This is a small and simple WebSocket client for Vue2

[![npm version](https://badge.fury.io/js/%40wuild%2Fvue-websocket.svg)](https://badge.fury.io/js/%40wuild%2Fvue-websocket)

## TODO
* Write a better README

## Installation
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
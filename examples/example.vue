<template>
    <div>
        <button @click="connect()" v-if="!connected && !connecting && !reconnecting">Connect</button>
        <button @click="disconnect()" v-else>Disconnect</button>
    </div>
</template>
<script>
    export default {
        methods: {
            connect() {
                this.$websocket.connect("wss://echo.websocket.org");
            },
            disconnect() {
                this.$websocket.disconnect();
            }
        },
        computed: {
            connected() {
                return this.$websocket.connected;
            },
            connecting() {
                return this.$websocket.connecting;
            },
            reconnecting() {
                return this.$websocket.reconnecting;
            },
            options() {
                return this.$websocket.options;
            }
        },
        events: {
            websocket: {
                open() {
                    console.log("WebSocket connection is open");
                    this.$websocket.send("hello world");
                    this.$websocket.send({
                        hello: "world"
                    });
                },
                close(event) {
                    console.log("WebSocket connection is closed", event);
                },
                message(message) {
                    console.log("WebSocket message received:", message);
                }
            }
        }
    }
</script>
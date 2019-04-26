const {isObject} = require("lodash");

export default {
    install(Vue) {
        Vue.prototype.$websocket = new Vue({
            data() {
                return {
                    _socket: undefined,
                    readyState: WebSocket.CLOSED,
                    options: {
                        url: "",
                        bodyParser: "json",
                        timeout: 3000,
                        reconnect: {
                            enabled: true,
                            attempts: 3,
                            delay: 3000
                        }
                    },
                    server: {
                        reconnecting: false,

                        // Timeout
                        connectionTimeoutId: 0,

                        // Reconnect data
                        reconnection: false,
                        reconnectionTimeoutId: 0,
                        reconnectionCount: 0
                    }
                }
            },
            computed: {
                connected() {
                    return this.readyState === WebSocket.OPEN;
                },
                connecting() {
                    return this.readyState === WebSocket.CONNECTING;
                },
                reconnecting() {
                    return this.server.reconnecting;
                }
            },
            methods: {

                /**
                 * Connect to WebSocket server
                 * @param url
                 * @param options
                 */
                connect(url, options) {
                    this.options = Object.assign({}, this.options, {
                        url: url
                    }, options || {});

                    this._socket = new WebSocket(this.options.url);
                    this._socket.onopen = this._onOpen.bind(this);
                    this._socket.onclose = this._onClose.bind(this);
                    this._socket.onmessage = this._onMessage.bind(this);
                    this._socket.onerror = this._onError.bind(this);

                    this.readyState = WebSocket.CONNECTING;
                },

                /**
                 * Disconnect from WebSocket
                 */
                disconnect() {
                    this.options.url = "";
                    this._socket.close(1000);
                },

                /**
                 * Send WebSocket message
                 * @param message
                 * @param bodyParser
                 */
                send(message, bodyParser) {
                    if (!this._socket)
                        return;

                    if (this._socket.readyState !== WebSocket.OPEN)
                        return;

                    switch (bodyParser || this.options.bodyParser) {
                        default: {
                            this._socket.send(message);
                            break;
                        }

                        case "json": {
                            this._socket.send(JSON.stringify(message));
                            break;
                        }
                    }
                },

                _reconnect() {
                    this.server.reconnectionCount++;
                    clearTimeout(this.server.reconnectionTimeoutId);
                    this.server.reconnecting = true;
                    this.options.reconnectionTimeoutId = setTimeout(function () {
                        this.connect(this.options.url, this.options);
                    }.bind(this), this.options.reconnect.delay);
                },

                /**
                 * On Websocket connection open
                 * @param opts
                 * @private
                 */
                _onOpen(...opts) {
                    this.readyState = WebSocket.OPEN;
                    this.server.reconnection = true;
                    this.$emit("open", ...opts);
                },

                /**
                 * On Websocket connection closed
                 * @param event
                 * @private
                 */
                _onClose(event) {
                    this.readyState = WebSocket.CLOSED;

                    if (this.options.reconnect.enabled && this.server.reconnection && !event.wasClean && this.server.reconnectionCount <= (this.options.reconnect.attempts - 1)) {
                        this._reconnect();
                    } else {
                        this.server.reconnecting = false;
                        this.server.reconnection = false;
                        this.server.reconnectionCount = 0;
                    }
                    this._socket = undefined;
                    this.$emit("close", event);
                },

                /**
                 * On Websocket message private function
                 * @emits message event
                 * @param event
                 * @private
                 */
                _onMessage(event) {
                    try {
                        switch (this.options.bodyParser.toLowerCase()) {
                            default: {
                                this.$emit("message", event.data);
                                break;
                            }

                            case "json": {
                                this.$emit("message", JSON.parse(event.data));
                                break;
                            }
                        }
                    } catch (e) {
                        this.$emit("message", event.data);
                    }
                },

                /**
                 * On WebSocket error
                 * @emits error
                 * @param opts
                 * @private
                 */
                _onError(...opts) {
                    this.$emit("error", ...opts);
                }
            }
        });

        /**
         * Setup WebSocket events using the "events" object in the component
         */
        Vue.mixin({
            beforeCreate: function () {
                if (isObject(this.$options.events) && this.$options.events.websocket)
                    Object.keys(this.$options.events.websocket).forEach((key) => {
                        let func = this.$options.events.websocket[key].bind(this);
                        this.$websocket.$on(key, func);
                        this.$options.events.websocket[key]._binded = func;
                    });
            },
            beforeDestroy() {
                if (isObject(this.$options.events) && this.$options.events.websocket)
                    Object.keys(this.$options.events.websocket).forEach((key) => {
                        this.$websocket.$off(key, this.$options.events.websocket[key]._binded);
                    });
            }
        });
    }
}
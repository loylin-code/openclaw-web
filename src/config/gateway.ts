// Gateway 配置
export interface GatewayConfig {
  url: string
  token?: string
  reconnect?: boolean
  reconnectInterval?: number
}

// 默认配置
export const defaultGatewayConfig: GatewayConfig = {
  url: 'ws://localhost:18789',
  token: '',
  reconnect: true,
  reconnectInterval: 5000
}

// 从环境变量读取
export function getGatewayConfig(): GatewayConfig {
  return {
    url: import.meta.env.VITE_GATEWAY_URL || defaultGatewayConfig.url,
    token: import.meta.env.VITE_GATEWAY_TOKEN || defaultGatewayConfig.token,
    reconnect: defaultGatewayConfig.reconnect,
    reconnectInterval: defaultGatewayConfig.reconnectInterval
  }
}

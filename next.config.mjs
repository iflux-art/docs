/** @type {import('next').NextConfig} */
const nextConfig = {
	// 自定义Webpack配置
	webpack: (config, { dev, isServer }) => {
		// 服务端配置
		if (isServer) {
			// 排除大文件从服务端包中
			config.externals = config.externals || [];
		}

		// 开发环境优化
		if (dev) {
			// 启用更快的源映射
			config.devtool = "eval-source-map";
			
			// 优化构建速度
			config.optimization = {
				...config.optimization,
				removeAvailableModules: false,
				removeEmptyChunks: false,
				splitChunks: {
					chunks: "all",
					cacheGroups: {
						default: false,
						vendors: false,
						// 单独打包React相关库
						react: {
							name: "react",
							chunks: "all",
							test: /[\\/]node_modules[\\/](react|react-dom|react-router)[\\/]/,
							priority: 40,
							enforce: true,
						},
						// 单独打包UI库
						ui: {
							name: "ui",
							chunks: "all",
							test: /[\\/]node_modules[\\/](@radix-ui|lucide-react)[\\/]/,
							priority: 30,
							enforce: true,
						},
					},
				},
				minimize: false,
			};
		}

		return config;
	},
};

// 导出配置
export default nextConfig;
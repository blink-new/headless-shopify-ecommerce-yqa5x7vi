# Headless Shopify E-commerce Website

A modern, fully functional headless e-commerce website built with React, TypeScript, and Vite that connects to Shopify's Storefront API for seamless product management and checkout functionality.

## 🚀 Features

- **Modern React Architecture**: Built with React 19, TypeScript, and Vite for optimal performance
- **Shopify Integration**: Full integration with Shopify Storefront API
- **Shopping Cart**: Complete cart management with add, update, remove functionality
- **Product Search**: Real-time product search with debounced queries
- **Responsive Design**: Mobile-first design that works on all devices
- **Product Filtering**: Filter by brand, category, price, and availability
- **Product Sorting**: Sort by name, price, date, and more
- **Image Optimization**: Responsive images with lazy loading
- **Toast Notifications**: User-friendly notifications for all actions
- **Loading States**: Skeleton loaders for better UX
- **SEO Friendly**: Optimized for search engines
- **Secure Checkout**: Redirects to Shopify's secure checkout

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Radix UI Components
- **State Management**: React Context API
- **API Client**: Shopify Storefront API Client
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Routing**: React Router DOM

## 📋 Prerequisites

Before you begin, ensure you have:

1. **Node.js** (version 18 or higher)
2. **npm** or **yarn** package manager
3. **Shopify Store** with products
4. **Shopify Storefront API Access Token**

## 🔧 Shopify Setup

### 1. Create a Private App in Shopify

1. Go to your Shopify Admin dashboard
2. Navigate to **Settings** > **Apps and sales channels**
3. Click **Develop apps** > **Create an app**
4. Give your app a name (e.g., "Headless Store")
5. Click **Create app**

### 2. Configure Storefront API Access

1. In your app, go to **Configuration**
2. Under **Storefront API access scopes**, enable:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_product_inventory`
   - `unauthenticated_read_product_tags`
   - `unauthenticated_read_collection_listings`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_checkouts`

3. Click **Save**

### 3. Generate Access Tokens

1. Go to **API credentials**
2. Under **Storefront access token**, click **Generate token**
3. Copy the generated token - you'll need this for `VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN`

### 4. Get Your Store Domain

Your store domain is in the format: `your-store-name.myshopify.com`

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd headless-shopify-ecommerce
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

1. Copy the example environment file:
```bash
cp .env.example .env.local
```

2. Update `.env.local` with your Shopify credentials:
```env
VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token-here
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/
│   ├── cart/              # Cart-related components
│   ├── layout/            # Layout components (Header, Footer)
│   ├── pages/             # Page components
│   ├── products/          # Product-related components
│   ├── search/            # Search functionality
│   └── ui/                # Reusable UI components
├── contexts/              # React Context providers
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and API clients
├── types/                 # TypeScript type definitions
└── App.tsx               # Main application component
```

## 🔌 API Integration

### Required Shopify API Access

The application requires the following Shopify Storefront API access:

1. **Products**: Read product information, variants, images, and pricing
2. **Collections**: Access product collections and categories
3. **Cart**: Create and manage shopping carts
4. **Checkout**: Generate checkout URLs for secure payment processing

### GraphQL Queries Used

- `PRODUCTS_QUERY`: Fetch products with pagination
- `PRODUCT_BY_HANDLE_QUERY`: Get individual product details
- `SEARCH_PRODUCTS_QUERY`: Search products by query
- `CREATE_CART_MUTATION`: Create new shopping cart
- `ADD_TO_CART_MUTATION`: Add items to cart
- `UPDATE_CART_MUTATION`: Update cart item quantities
- `REMOVE_FROM_CART_MUTATION`: Remove items from cart
- `GET_CART_QUERY`: Retrieve cart information

## 🎨 Customization

### Styling

The application uses Tailwind CSS for styling. You can customize:

1. **Colors**: Update the color palette in `src/index.css`
2. **Components**: Modify component styles in individual component files
3. **Layout**: Adjust layout components in `src/components/layout/`

### Branding

1. **Logo**: Update the logo in `src/components/layout/Header.tsx`
2. **Store Name**: Change "Store" to your brand name throughout the application
3. **Colors**: Update the primary and accent colors in the CSS variables

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Netlify

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Set environment variables in Netlify dashboard

### Deploy to Vercel

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

## 🔒 Security Considerations

1. **Environment Variables**: Never commit `.env.local` to version control
2. **API Tokens**: Use only Storefront API tokens (not Admin API tokens) in frontend
3. **HTTPS**: Always use HTTPS in production
4. **Content Security Policy**: Implement CSP headers for additional security

## 🐛 Troubleshooting

### Common Issues

1. **"Failed to load products"**
   - Check your Shopify store domain and access token
   - Ensure Storefront API permissions are correctly set
   - Verify your store has published products

2. **"Cart creation failed"**
   - Check cart-related API permissions
   - Ensure product variants are available for sale

3. **Images not loading**
   - Verify product images are uploaded in Shopify
   - Check image URLs in Shopify admin

### Debug Mode

Enable debug logging by adding to your `.env.local`:
```env
VITE_DEBUG=true
```

## 📚 Additional Resources

- [Shopify Storefront API Documentation](https://shopify.dev/api/storefront)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Vite Documentation](https://vitejs.dev)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or need help setting up the application, please:

1. Check the troubleshooting section above
2. Review Shopify's API documentation
3. Create an issue in the repository

---

**Happy selling! 🛍️**
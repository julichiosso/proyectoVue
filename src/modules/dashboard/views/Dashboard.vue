<template>
  <div class="dashboard">
    <!-- Header -->
    <h1 class="title">Dashboard</h1>

    <!-- Stats Cards -->
    <div class="cards">
      <div class="card">
        <p class="label">Total Portfolio Value</p>
        <p class="value">$67,210.00</p>
        <p class="change positive">+2.1% from last period</p>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-dollar-sign h-4 w-4 text-muted-foreground"><line x1="12" x2="12" y1="2" y2="22"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
      </div>
      <div class="card">
        <p class="label">24h Performance</p>
        <p class="value positive">+ $1,250.45</p>
        <p class="change positive">+1.8% from last period</p>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trending-up h-4 w-4 text-muted-foreground"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
      </div>
      <div class="card">
        <p class="label">Total P/L</p>
        <p class="value">$5,890.12</p>
        <p class="change positive">+9.6% from last period</p>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wallet h-4 w-4 text-muted-foreground"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path></svg>
      </div>
      <div class="card">
        <p class="label">Worst Performer (24h)</p>
        <p class="value">Ethereum</p>
        <p class="change negative">-0.5% from last period</p>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trending-down h-4 w-4 text-muted-foreground"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"></polyline><polyline points="16 17 22 17 22 11"></polyline></svg>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main">
      <!-- Recent Transactions -->
      <div class="transactions">
        <div class="transactions-header">
          <div>
            <h2>Recent Transactions</h2>
            <p class="subtitle">The last 5 transactions across all clients.</p>
          </div>
          <button class="view-all">View All</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Client</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Value (USD)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <p class="client-name">Pedro Gonzales</p>
                <p class="client-email">pedrogonzales@mail.com</p>
              </td>
              <td><span class="tag purchase">Purchase</span></td>
              <td>0.5 BTC</td>
              <td>$30,000</td>
            </tr>
            <tr>
              <td>
                <p class="client-name">Agustin Ruatta</p>
                <p class="client-email">agustinruatta@gmail.com</p>
              </td>
              <td><span class="tag purchase">Purchase</span></td>
              <td>2 ETH</td>
              <td>$4,000</td>
            </tr>
            <tr>
              <td>
                <p class="client-name">Pedro Gonzales</p>
                <p class="client-email">pedrogonzales@mail.com</p>
              </td>
              <td><span class="tag purchase">Purchase</span></td>
              <td>1000 USDC</td>
              <td>$1,000</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Portfolio Composition -->
      <div class="portfolio">
        <h2>Portfolio Composition</h2>
        <p class="subtitle">Distribution of assets by current value.</p>
        <div class="donut"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
};
</script>

<style scoped>
.dashboard {
  border-radius: 6px;
  color: #030711;
  background: #f3f4f6;
  min-height: 100vh;
  padding: 24px;
  font-family: sans-serif;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 24px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.card {
  
  background: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

.label {
  
  font-size: 14px;
  color: #030711;
}

.value {
  font-size: 22px;
  font-weight: bold;
  margin: 4px 0;
}

.value.positive {
  color: #16a34a;
}

.change {
  font-size: 12px;
}

.positive {
  color: #16a34a;
}

.negative {
  color: #dc2626;
}

.main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.transactions, .portfolio {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  padding: 16px;
}

.transactions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.subtitle {
  color: #6b7280;
  font-size: 12px;
}

.view-all {
  background: #6d28d9;
  color: white;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 12px;
  border: none;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

thead {
  color: #6b7280;
}

th, td {
  padding: 8px 0;
  text-align: left;
}

tr {
  border-bottom: 1px solid #e5e7eb;
}

.client-name {
  font-weight: 500;
}

.client-email {
  font-size: 12px;
  color: #6b7280;
}

.tag {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.purchase {
  background: #dcfce7;
  color: #15803d;
}

.portfolio {
  text-align: center;
}

.donut {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  border: 30px solid black;
  border-top-color: transparent;
  margin: 20px auto 0;
}


</style>

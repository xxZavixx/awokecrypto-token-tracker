"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "chart.js/auto";
import type { Chart as ChartType } from "chart.js";

type MarketCoin = { id: string; name: string; symbol: string; current_price: number };
type PortfolioItem = { id: string; name: string; holdings: number };

const COINGECKO_MARKETS =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1";
const COINGECKO_LIST = "https://api.coingecko.com/api/v3/coins/list";

async function fetchWithRetry(url: string, retries = 3) {
  let i = 0;
  while (i < retries) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      i++;
      if (i === retries) throw e;
      await new Promise((r) => setTimeout(r, 400 * i));
    }
  }
}

export default function Page() {
  // holdings
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("portfolio") || "[]");
    } catch {
      return [];
    }
  });

  // market + list
  const [marketCoins, setMarketCoins] = useState<MarketCoin[]>([]);
  const [coinList, setCoinList] = useState<{ id: string; name: string; symbol: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // form
  const [selected, setSelected] = useState("");
  const [amount, setAmount] = useState("");

  // totals
  const totalValue = useMemo(() => {
   return portfolio.reduce((sum, p) => {
      const m = marketCoins.find((c) => c.id === p.id);
      return sum + p.holdings * (m?.current_price ?? 0);
    }, 0);
  }, [portfolio, marketCoins]);

  // chart
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<ChartType | null>(null);
  const [chartLoading, setChartLoading] = useState(false);

  // load data
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setLoadError(null);

        const markets = (await fetchWithRetry(COINGECKO_MARKETS)) as any[];
        setMarketCoins(
          markets.map((m) => ({
            id: m.id,
            name: m.name,
            symbol: String(m.symbol || "").toUpperCase(),
            current_price: Number(m.current_price || 0),
          }))
        );

        // list for searching
        const list = (await fetchWithRetry(COINGECKO_LIST)) as any[];
        setCoinList(
          list.map((c) => ({
            id: c.id,
            name: c.name,
            symbol: String(c.symbol || "").toLowerCase(),
          }))
        );
      } catch (err: any) {
        console.error(err);
        setLoadError(err?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // persist portfolio
  useEffect(() => {
    localStorage.setItem("portfolio", JSON.stringify(portfolio));
  }, [portfolio]);

  // update holdings
  function onUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!selected || amount === "") return;

    const amt = parseFloat(amount);
    const name =
      marketCoins.find((c) => c.id === selected)?.name ||
      coinList.find((c) => c.id === selected)?.name ||
      selected;

    setPortfolio((prev) => {
      let next = [...prev];
      const existing = next.find((c) => c.id === selected);
      if (amt === 0) {
        next = next.filter((c) => c.id !== selected);
        alert(`${name} removed from portfolio.`);
      } else if (existing) {
        existing.holdings = amt;
      } else {
        next.push({ id: selected, name, holdings: amt });
      }
      return next;
    });

    setAmount("");
    setSelected("");
  }

  // search + chart (7d)
  async function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const raw = (document.getElementById("search-input") as HTMLInputElement)?.value
      ?.trim()
      .toLowerCase();
    if (!raw) return;

    const match =
      coinList.find((c) => c.name.toLowerCase() === raw || c.symbol.toLowerCase() === raw) ||
      coinList.find((c) => c.name.toLowerCase().includes(raw)) ||
      coinList.find((c) => c.symbol.toLowerCase().includes(raw));

    if (!match) return alert("Cryptocurrency not found. Try a different name or symbol.");

    setChartLoading(true);
    try {
      const data = await fetchWithRetry(
        `https://api.coingecko.com/api/v3/coins/${match.id}/market_chart?vs_currency=usd&days=7`
      );
      const labels = (data.prices as [number, number][])?.map(([t]) =>
        new Date(t).toLocaleDateString()
      );
      const values = (data.prices as [number, number][])?.map(([_, p]) => p);

      const ctx = chartRef.current?.getContext("2d");
      if (!ctx) return;
      if (chartInstance.current) chartInstance.current.destroy();

      const { default: Chart } = await import("chart.js/auto");
      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: `${match.name} (7d)`,
              data: values,
              borderWidth: 2,
              fill: true,
              tension: 0.25,
            },
          ],
        },
        options: { responsive: true, maintainAspectRatio: false },
      });

      (document.getElementById("chart-wrap") as HTMLElement).style.display = "block";
    } catch (err) {
      console.error(err);
      alert("Failed to fetch chart data.");
    } finally {
      setChartLoading(false);
    }
  }

  return (
    <main className="container py-5">
      <div className="content-slab">
        <h1 className="text-center mb-3">Welcome to My Crypto Portfolio</h1>

        <p className="text-center">
          Easily manage your cryptocurrency investments and track real-time portfolio values fetched from CoinGecko.
        </p>
        <p className="text-warning text-center fw-bold">
          Disclaimer: This tool is for informational purposes only. To remove a cryptocurrency, enter “0” and click “Update Holdings.”
        </p>

        {/* Update holdings */}
        <form onSubmit={onUpdate} className="row justify-content-center g-2 mb-3">
          <div className="col-md-5">
            <select
              className="form-select"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              disabled={loading}
            >
              <option value="">{loading ? "Loading..." : "Select a cryptocurrency"}</option>
              {marketCoins.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.symbol})
                </option>
              ))}
            </select>
            {loadError && <div className="text-danger mt-2 text-center">{loadError}</div>}
          </div>
          <div className="col-md-3">
            <input
              className="form-control"
              type="number"
              step="any"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="col-md-2 d-grid">
            <button className="btn btn-primary" type="submit">
              Update Holdings
            </button>
          </div>
        </form>

        {/* Table */}
        <div className="table-responsive section-gap">
          <table className="table table-dark table-striped align-middle">
            <thead>
              <tr>
                <th>Cryptocurrency</th>
                <th>Holdings</th>
                <th>Price (USD)</th>
                <th>Total Value (USD)</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center">
                    No holdings yet.
                  </td>
                </tr>
              ) : (
                portfolio.map((p) => {
                  const price = marketCoins.find((m) => m.id === p.id)?.current_price ?? 0;
                  const total = p.holdings * price;
                  return (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td>{p.holdings}</td>
                      <td>${price.toFixed(2)}</td>
                      <td>${total.toFixed(2)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <h5 className="text-center mt-3 fw-bold" style={{ color: "#e9f6ff", textShadow: "0 0 10px rgba(0,200,255,0.5)" }}>
  Total Portfolio Value: ${totalValue.toFixed(2)}
</h5>


        {/* Search + 7d chart */}
        <div className="mt-5">
          <h3 className="text-center">Crypto Data Chart</h3>
          <p className="chart-instruction">Search by name or symbol (e.g., Bitcoin or BTC).</p>
          <form onSubmit={onSearch} className="row justify-content-center g-2 mb-3">
            <div className="col-md-6">
              <input
                id="search-input"
                className="form-control"
                placeholder="Search for a cryptocurrency"
              />
            </div>
            <div className="col-md-2 d-grid">
              <button className="btn btn-success" type="submit">
                Search
              </button>
            </div>
          </form>

          <div className="text-center" style={{ minHeight: 240 }}>
            {chartLoading && (
              <div className="spinner-border text-primary my-3" role="status" />
            )}
            <div id="chart-wrap" style={{ display: "none", height: 240 }}>
              <canvas ref={chartRef} />
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-muted mt-3" style={{ fontSize: 12 }}>
        © {new Date().getFullYear()} AwokeCrypto — Mini App
      </div>
    </main>
  );
}

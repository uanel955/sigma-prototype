import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const clinic = {
  name: "Glow Copenhagen",
  subtitle: "Hudpleje, bryn og laser",
  description:
    "En moderne skønhedsklinik med nem booking, tydelige behandlinger og en app-lignende kundeoplevelse.",
  address: "Gammel Kongevej 82, Frederiksberg",
  phone: "+45 31 42 88 90"
};

const initialTreatments = [
  {
    id: 1,
    name: "Klassisk ansigtsbehandling",
    category: "Hudpleje",
    duration: 60,
    price: 695,
    description: "Dyberens, peeling, maske og afsluttende fugtpleje."
  },
  {
    id: 2,
    name: "Brow lift",
    category: "Bryn",
    duration: 45,
    price: 495,
    description: "Formning og løft af bryn for et mere åbent udtryk."
  },
  {
    id: 3,
    name: "Lash lift",
    category: "Vipper",
    duration: 50,
    price: 545,
    description: "Naturligt løft af vipperne uden extensions."
  },
  {
    id: 4,
    name: "Laser hårfjerning",
    category: "Laser",
    duration: 30,
    price: 750,
    description: "Laserbehandling til reduktion af hårvækst."
  }
];

const days = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag"];
const times = ["09:00", "10:30", "12:00", "14:00", "16:00", "17:30"];

function formatPrice(price) {
  return new Intl.NumberFormat("da-DK", {
    style: "currency",
    currency: "DKK",
    maximumFractionDigits: 0
  }).format(price);
}

function App() {
  const [mode, setMode] = useState("client");
  const [tab, setTab] = useState("home");
  const [adminTab, setAdminTab] = useState("overview");
  const [treatments, setTreatments] = useState(initialTreatments);
  const [bookings, setBookings] = useState([]);
  const [selectedTreatment, setSelectedTreatment] = useState(null);

  function createBooking(booking) {
    setBookings((current) => [
      {
        id: crypto.randomUUID(),
        status: "Bekræftet",
        ...booking
      },
      ...current
    ]);

    setSelectedTreatment(null);
    setTab("bookings");
  }

  return (
    <div className="app">
      <div className="phone">
        <header className="topbar">
          <div className="brand">
            <div className="logo">S</div>
            <div>
              <strong>Sigma</strong>
              <span>Beauty platform</span>
            </div>
          </div>

          <div className="switch">
            <button
              className={mode === "client" ? "active" : ""}
              onClick={() => setMode("client")}
            >
              Kunde
            </button>
            <button
              className={mode === "admin" ? "active" : ""}
              onClick={() => setMode("admin")}
            >
              Klinik
            </button>
          </div>
        </header>

        {mode === "client" ? (
          <ClientApp
            tab={tab}
            setTab={setTab}
            clinic={clinic}
            treatments={treatments}
            bookings={bookings}
            onBook={setSelectedTreatment}
          />
        ) : (
          <AdminApp
            tab={adminTab}
            setTab={setAdminTab}
            treatments={treatments}
            setTreatments={setTreatments}
            bookings={bookings}
          />
        )}

        {selectedTreatment && (
          <BookingModal
            treatment={selectedTreatment}
            onClose={() => setSelectedTreatment(null)}
            onConfirm={createBooking}
          />
        )}
      </div>
    </div>
  );
}

function ClientApp({ tab, setTab, clinic, treatments, bookings, onBook }) {
  const [category, setCategory] = useState("Alle");

  const categories = useMemo(() => {
    return ["Alle", ...new Set(treatments.map((item) => item.category))];
  }, [treatments]);

  const visibleTreatments =
    category === "Alle"
      ? treatments
      : treatments.filter((item) => item.category === category);

  return (
    <>
      <main className="screen">
        {tab === "home" && (
          <section className="stack">
            <div className="hero">
              <p className="eyebrow">Skønhedsklinik</p>
              <h1>{clinic.name}</h1>
              <p>{clinic.description}</p>

              <div className="actions">
                <button className="primary" onClick={() => setTab("treatments")}>
                  Book behandling
                </button>
                <button className="secondary" onClick={() => setTab("bookings")}>
                  Mine tider
                </button>
              </div>
            </div>

            <div className="info-grid">
              <div className="info-card">
                <span>Adresse</span>
                <strong>{clinic.address}</strong>
              </div>
              <div className="info-card">
                <span>Kontakt</span>
                <strong>{clinic.phone}</strong>
              </div>
            </div>

            <SectionTitle title="Populære behandlinger" />
            <div className="cards">
              {treatments.slice(0, 3).map((treatment) => (
                <TreatmentCard
                  key={treatment.id}
                  treatment={treatment}
                  onBook={() => onBook(treatment)}
                />
              ))}
            </div>
          </section>
        )}

        {tab === "treatments" && (
          <section className="stack">
            <div className="page-title">
              <p className="eyebrow">{clinic.subtitle}</p>
              <h1>Behandlinger</h1>
              <p>Vælg en behandling og book en ledig tid.</p>
            </div>

            <div className="pills">
              {categories.map((item) => (
                <button
                  key={item}
                  className={category === item ? "active" : ""}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="cards">
              {visibleTreatments.map((treatment) => (
                <TreatmentCard
                  key={treatment.id}
                  treatment={treatment}
                  onBook={() => onBook(treatment)}
                />
              ))}
            </div>
          </section>
        )}

        {tab === "bookings" && (
          <section className="stack">
            <div className="page-title">
              <p className="eyebrow">Kunde</p>
              <h1>Mine tider</h1>
              <p>Her ser kunden sine kommende bookinger.</p>
            </div>

            {bookings.length === 0 ? (
              <EmptyState
                title="Ingen bookinger endnu"
                text="Book en behandling for at se den her."
              />
            ) : (
              <div className="cards">
                {bookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      <BottomNav
        active={tab}
        setActive={setTab}
        items={[
          ["home", "Hjem"],
          ["treatments", "Behandlinger"],
          ["bookings", "Mine tider"]
        ]}
      />
    </>
  );
}

function AdminApp({ tab, setTab, treatments, setTreatments, bookings }) {
  const revenue = bookings.reduce((sum, item) => sum + item.treatment.price, 0);

  function addTreatment() {
    setTreatments((current) => [
      {
        id: Date.now(),
        name: "Ny behandling",
        category: "Hudpleje",
        duration: 45,
        price: 500,
        description: "Kort beskrivelse af behandlingen."
      },
      ...current
    ]);
  }

  function updateTreatment(id, field, value) {
    setTreatments((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]:
                field === "price" || field === "duration"
                  ? Number(value)
                  : value
            }
          : item
      )
    );
  }

  function removeTreatment(id) {
    setTreatments((current) => current.filter((item) => item.id !== id));
  }

  return (
    <>
      <main className="screen">
        {tab === "overview" && (
          <section className="stack">
            <div className="page-title">
              <p className="eyebrow">Klinik-admin</p>
              <h1>Dashboard</h1>
              <p>Et simpelt overblik over klinikkens app.</p>
            </div>

            <div className="stats">
              <Stat label="Bookinger" value={bookings.length} />
              <Stat label="Behandlinger" value={treatments.length} />
              <Stat label="Omsætning" value={formatPrice(revenue)} />
            </div>

            <SectionTitle title="Seneste bookinger" />

            {bookings.length === 0 ? (
              <EmptyState
                title="Ingen bookinger endnu"
                text="Når kunder booker, vises de her."
              />
            ) : (
              <div className="cards">
                {bookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            )}
          </section>
        )}

        {tab === "treatments" && (
          <section className="stack">
            <div className="row-title">
              <div>
                <p className="eyebrow">Admin</p>
                <h1>Ydelser</h1>
              </div>
              <button className="primary small" onClick={addTreatment}>
                Tilføj
              </button>
            </div>

            <div className="cards">
              {treatments.map((treatment) => (
                <div className="edit-card" key={treatment.id}>
                  <label>
                    Navn
                    <input
                      value={treatment.name}
                      onChange={(e) =>
                        updateTreatment(treatment.id, "name", e.target.value)
                      }
                    />
                  </label>

                  <div className="split">
                    <label>
                      Kategori
                      <input
                        value={treatment.category}
                        onChange={(e) =>
                          updateTreatment(
                            treatment.id,
                            "category",
                            e.target.value
                          )
                        }
                      />
                    </label>

                    <label>
                      Pris
                      <input
                        type="number"
                        value={treatment.price}
                        onChange={(e) =>
                          updateTreatment(treatment.id, "price", e.target.value)
                        }
                      />
                    </label>
                  </div>

                  <label>
                    Varighed
                    <input
                      type="number"
                      value={treatment.duration}
                      onChange={(e) =>
                        updateTreatment(
                          treatment.id,
                          "duration",
                          e.target.value
                        )
                      }
                    />
                  </label>

                  <label>
                    Beskrivelse
                    <textarea
                      value={treatment.description}
                      onChange={(e) =>
                        updateTreatment(
                          treatment.id,
                          "description",
                          e.target.value
                        )
                      }
                    />
                  </label>

                  <button
                    className="danger"
                    onClick={() => removeTreatment(treatment.id)}
                  >
                    Fjern
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {tab === "bookings" && (
          <section className="stack">
            <div className="page-title">
              <p className="eyebrow">Admin</p>
              <h1>Bookinger</h1>
              <p>Alle bookinger i denne prototype.</p>
            </div>

            {bookings.length === 0 ? (
              <EmptyState title="Ingen bookinger" text="Test kunde-flowet først." />
            ) : (
              <div className="cards">
                {bookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      <BottomNav
        active={tab}
        setActive={setTab}
        items={[
          ["overview", "Overblik"],
          ["treatments", "Ydelser"],
          ["bookings", "Bookinger"]
        ]}
      />
    </>
  );
}

function TreatmentCard({ treatment, onBook }) {
  return (
    <article className="card">
      <p className="category">{treatment.category}</p>
      <h3>{treatment.name}</h3>
      <p>{treatment.description}</p>

      <div className="card-footer">
        <span>
          {treatment.duration} min · {formatPrice(treatment.price)}
        </span>
        <button onClick={onBook}>Book</button>
      </div>
    </article>
  );
}

function BookingModal({ treatment, onClose, onConfirm }) {
  const [day, setDay] = useState(days[0]);
  const [time, setTime] = useState(times[0]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const canSubmit = name.trim().length > 1 && phone.trim().length > 5;

  function handleSubmit(e) {
    e.preventDefault();

    if (!canSubmit) return;

    onConfirm({
      treatment,
      day,
      time,
      name,
      phone
    });
  }

  return (
    <div className="modal-bg">
      <form className="modal" onSubmit={handleSubmit}>
        <button type="button" className="close" onClick={onClose}>
          Luk
        </button>

        <p className="eyebrow">Booking</p>
        <h2>{treatment.name}</h2>
        <p className="modal-sub">
          {treatment.duration} min · {formatPrice(treatment.price)}
        </p>

        <label>
          Dag
          <select value={day} onChange={(e) => setDay(e.target.value)}>
            {days.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>

        <label>
          Tid
          <select value={time} onChange={(e) => setTime(e.target.value)}>
            {times.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>

        <label>
          Navn
          <input
            value={name}
            placeholder="Dit navn"
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label>
          Telefon
          <input
            value={phone}
            placeholder="+45 ..."
            onChange={(e) => setPhone(e.target.value)}
          />
        </label>

        <button className="primary full" disabled={!canSubmit}>
          Bekræft booking
        </button>
      </form>
    </div>
  );
}

function BookingCard({ booking }) {
  return (
    <article className="card">
      <p className="category">{booking.status}</p>
      <h3>{booking.treatment.name}</h3>
      <p>
        {booking.day} kl. {booking.time}
      </p>
      <p>
        {booking.name} · {booking.phone}
      </p>

      <div className="card-footer">
        <span>{formatPrice(booking.treatment.price)}</span>
      </div>
    </article>
  );
}

function SectionTitle({ title }) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function EmptyState({ title, text }) {
  return (
    <div className="empty">
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

function BottomNav({ items, active, setActive }) {
  return (
    <nav className="bottom-nav">
      {items.map(([id, label]) => (
        <button
          key={id}
          className={active === id ? "active" : ""}
          onClick={() => setActive(id)}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}

createRoot(document.getElementById("root")).render(<App />);

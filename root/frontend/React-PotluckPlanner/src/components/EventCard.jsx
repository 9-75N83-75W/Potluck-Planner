// imports

export default function EventCard({ eventInfo, guests}) {

    // console.log("Event Info:", eventInfo)
    // console.log("Event Guest:", guests)

    return(
        <>
            {/* <h1>Event Details</h1> */}
            <div style={{ height: "100%", padding: "26px 30px", margin: "16px", backgroundColor: "white", borderRadius: "16px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "10px 14px" }}>

                    {/* Header */}
                    <div style={{ display: "flex", flexDirection: "column", padding: "10px 14px", margin: "24px", }}>
                        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", alignItems: "center", columnGap: "8px", }}>

                            {/* Emoji */}
                            <span style={{ fontSize: "100px", padding: "8px", color: "#2563eb" }}>👥</span>

                            {/* Event name */}
                            <h2 style={{ fontSize: "36px", fontWeight: 600, color: "#1f2937", margin: 0, }}>
                                {eventInfo.eventName}
                            </h2>

                            {/* Guests count spans both columns, sits below */}
                            <span style={{ gridColumn: "1 / -1", backgroundColor: "#dbeafe", color: "#1e40af", fontSize: "18px", padding: "8px 16px", borderRadius: "16px", marginTop: "2px", justifySelf: "start", }}>
                                # of Guests: {guests.length}
                            </span>
                        </div>
                    </div>


                    {/* Details */}
                    {/* <div style={{ display: "flex", flexDirection: "column", padding: "10px 14px", margin: "24px", marginTop: "1px", gap: "12px", maxHeight: maxHeight, paddingRight: "4px", }}> */}
                    <div style={{ height: "100%", padding: "26px 30px", margin: "16px", backgroundColor: "white", borderRadius: "16px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)", border: "1px solidrgb(24, 24, 24)" }}>

                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <h3 style={{ fontSize: "18px", fontWeight: 500, color: "#1f2937", margin: "0 0 4px 0" }}>
                                👤 Host:
                            </h3>
                            <p style={{ fontSize: "18px", color: "#6b7280", margin: "0 0 4px 0" }}>
                                {eventInfo.host.firstName} {eventInfo.host.lastName}
                            </p>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <h3 style={{ fontSize: "18px", fontWeight: 500, color: "#1f2937", margin: "0 0 4px 0" }}>
                                ✉️ Contact Email:
                            </h3>
                            <p style={{ fontSize: "18px", color: "#6b7280", margin: "0 0 4px 0" }}>
                                {eventInfo.host.email}
                            </p>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <h3 style={{ fontSize: "18px", fontWeight: 500, color: "#1f2937", margin: "0 0 4px 0" }}>
                                🗓️ Date:
                            </h3>
                            <p style={{ fontSize: "18px", color: "#6b7280", margin: "0 0 4px 0" }}>
                                {new Date(eventInfo.dateTime).toLocaleString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                })}
                            </p>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <h3 style={{ fontSize: "18px", fontWeight: 500, color: "#1f2937", margin: "0 0 4px 0" }}>
                                ⏰ Time:
                            </h3>
                            <p style={{ fontSize: "18px", color: "#6b7280", margin: "0 0 4px 0" }}>
                                {new Date(eventInfo.dateTime).toLocaleString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </p>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <h3 style={{ fontSize: "18px", fontWeight: 500, color: "#1f2937", margin: "0 0 4px 0" }}>
                                📍 Location:
                            </h3>
                            <p style={{ fontSize: "18px", color: "#6b7280", margin: "0 0 4px 0" }}>
                                {eventInfo.location}
                            </p>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", alignItems: "start", columnGap: "4px", marginBottom: "8px", }}>
                            <h3 style={{ fontSize: "18px", fontWeight: 500, color: "#1f2937", margin: "0" }}>
                                🖇️ Description:
                            </h3>
                            <p style={{ fontSize: "18px", color: "#6b7280", margin: "0" }}>
                                {eventInfo.description}
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}
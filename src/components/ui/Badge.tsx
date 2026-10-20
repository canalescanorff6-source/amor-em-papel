export function Badge({children,tone='pink'}:{children:React.ReactNode;tone?:'pink'|'blue'|'yellow'|'neutral'}){return <span className={`badge badge-${tone}`}>{children}</span>}

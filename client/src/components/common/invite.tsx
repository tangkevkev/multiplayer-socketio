import toast from 'react-hot-toast';
import logos from '../../assets/logos'
import './invite.css'


type InviteProps = {
    link: string,
    author: string,
    id: string
}

export const Invite = ({ link, author, id }: InviteProps) => {
    const text = "Join " + author + " to play poker!"
    const telegram_link = "https://t.me/share/url?url=" + link + "&text=" + text
    const whatsapp_link = "whatsapp://send?text=" + link

    function copyToClipboard(toCopy: string) {
        const el = document.createElement('textarea')
        el.value = toCopy
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);

        toast.success('Copied to clipboard');
    }

    return (
        <div className="total">
            <h3>Invite your friends</h3>
            <div className="totalBox">
                <div className="shareBox">
                    <a href={telegram_link} target="popup" rel="norefferer">

                        <button >
                            <img alt='logo' style={{ width: 30, height: 30 }} src={logos["telegram"]} />
                            <b> Telegram</b>
                        </button>
                    </a>
                    <a href={whatsapp_link} target="popup" rel="norefferer">

                        <button >
                            <img alt='logo' style={{ width: 30, height: 30 }} src={logos["whatsapp"]} />
                            <b> WhatsApp</b>
                        </button>
                    </a>
                </div>
            </div>
            or share this link
            <div className="link">
                {link}
            </div>
            <button type="button" className="copyButton" onClick={() => copyToClipboard(link)}>
                Copy to clipboard
            </button>


        </div>

    );

    /**
     *   <div>
                Game identifier
        </div>
             <div className="link">
                {id}
            </div>
            <button type="button" className="copyButton" onClick={() => copyToClipboard(id)}>
                Copy to clipboard
            </button>
     */

}

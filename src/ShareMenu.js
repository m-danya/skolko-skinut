import React from 'react'
import {
    Button,
    Container,
    Grid,
    Header,
    Icon,
    Input,
    Image,
    Modal,
    Item,
    Label,
    Menu,
    Checkbox,
    Segment,
    Step,
    Table,
    GridColumn,
} from "semantic-ui-react";
import {
    isBrowser,
    isMobile
} from "react-device-detect";
import webShare from 'react-web-share-api';
import funny_gif from './assets/funny.gif'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import swal from 'sweetalert';



function ShareMenu(props) {
    const [open, setOpen] = React.useState(false)

    return (
        <CopyToClipboard
            text={props.copyText}
        >
            <div style={{ textAlign: "center" }}>
                <Button
                circular
                    color='blue'
                    size='huge'
                    onClick={webShare.isSupported ? webShare.share : () => {
                        swal("Готово", "Ссылка скопирована в буфер обмена", "success")
                    }}
                >
                    <Icon name='share' />
                    Скопировать ссылку на проект
                </Button>
                <p className='centerText tableHeaderFont hint'>
                    Ссылку можно отправить друзьям или сохранить себе, чтобы не потерять проект

                </p>
            </div>
        </CopyToClipboard>


    )

}

export default ShareMenu
import { h, JSX } from 'preact';

interface Props {
  size?: number;
}

export function IconTrash({ size = 24 }: Props): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.1211 6.00005L11.1755 6.00011H12.8189L12.8733 6.00005C13.1297 5.99967 13.3546 5.99933 13.555 6.07817C13.7303 6.1471 13.8855 6.25893 14.0063 6.40341C14.1445 6.56864 14.2153 6.78215 14.296 7.02542L14.3131 7.07705L14.5164 7.68677H16.495H17.6194C17.8265 7.68677 17.9944 7.85466 17.9944 8.06177C17.9944 8.26887 17.8265 8.43677 17.6194 8.43677H16.8486L16.4843 14.6294L16.4833 14.6453L16.4833 14.6454L16.4833 14.6454C16.453 15.162 16.4288 15.5719 16.3829 15.9021C16.3359 16.2402 16.2625 16.5251 16.1169 16.7838C15.8804 17.2044 15.5214 17.5429 15.0877 17.7543C14.8209 17.8844 14.5321 17.9409 14.1919 17.968C13.8596 17.9945 13.4489 17.9945 12.9314 17.9945H12.9154H11.079H11.063C10.5455 17.9945 10.1348 17.9945 9.80254 17.968C9.46229 17.9409 9.1735 17.8844 8.90671 17.7543C8.47301 17.5429 8.11399 17.2044 7.87745 16.7838C7.73195 16.5251 7.65854 16.2402 7.6115 15.9021C7.56556 15.5719 7.54145 15.162 7.51106 14.6454L7.51013 14.6294L7.14585 8.43677H6.375C6.16789 8.43677 6 8.26887 6 8.06177C6 7.85466 6.16789 7.68677 6.375 7.68677H7.49944H9.47804L9.68128 7.07705L9.69843 7.02542L9.69843 7.02542C9.77911 6.78215 9.84993 6.56864 9.98811 6.40341C10.1089 6.25893 10.2641 6.1471 10.4394 6.07817C10.6398 5.99933 10.8648 5.99967 11.1211 6.00005ZM13.7258 7.68677H10.2686L10.3928 7.31422C10.5013 6.98881 10.5289 6.92587 10.5634 6.88454C10.6037 6.83638 10.6554 6.7991 10.7139 6.77613C10.764 6.75641 10.8324 6.75011 11.1755 6.75011H12.8189C13.162 6.75011 13.2304 6.75641 13.2805 6.77613C13.339 6.7991 13.3907 6.83638 13.431 6.88454C13.4655 6.92587 13.4931 6.98881 13.6016 7.31422L13.7258 7.68677ZM11.2477 10.8727C11.2477 10.6656 11.0799 10.4977 10.8727 10.4977C10.6656 10.4977 10.4977 10.6656 10.4977 10.8727V14.8082C10.4977 15.0153 10.6656 15.1832 10.8727 15.1832C11.0799 15.1832 11.2477 15.0153 11.2477 14.8082V10.8727ZM13.4966 10.8727C13.4966 10.6656 13.3287 10.4977 13.1216 10.4977C12.9145 10.4977 12.7466 10.6656 12.7466 10.8727V13.1216C12.7466 13.3287 12.9145 13.4966 13.1216 13.4966C13.3287 13.4966 13.4966 13.3287 13.4966 13.1216V10.8727Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function IconLinkBreak({ size = 24 }: Props): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path d="M9.42857 6V8.57143H10.2857V6H9.42857ZM17.2311 6.768C16.2351 5.77286 14.6211 5.77286 13.6251 6.768L11.268 9.12514L11.874 9.732L14.2311 7.37486C14.892 6.71314 15.9643 6.71314 16.6251 7.37486C17.286 8.03486 17.286 9.10714 16.6251 9.768L14.268 12.1251L14.874 12.732L17.2311 10.3749C18.2271 9.37886 18.2271 7.764 17.2311 6.768ZM6.768 17.2311C5.772 16.236 5.772 14.6211 6.768 13.6251L9.12514 11.268L9.73114 11.8749L7.374 14.232C6.71314 14.892 6.71314 15.9643 7.374 16.6251C8.03486 17.2869 9.10714 17.2869 9.768 16.6251L12.1251 14.268L12.7311 14.874L10.374 17.2311C9.378 18.2271 7.764 18.2271 6.768 17.2311ZM18 14.5714H15.4286V13.7143H18V14.5714ZM14.5714 15.4286V18H13.7143V15.4286H14.5714ZM8.57143 9.42857H6V10.2857H8.57143V9.42857Z" fill="currentColor" />
    </svg>
  );
}

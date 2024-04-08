import styles from './styles.module.css';

type TypographySizeType = 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl';
type TypographyVariant = 'primary' | 'secondary' | 'tertiary';


const Typography = ({text, size, variant}:{text: string, size: TypographySizeType; variant: TypographyVariant}) => {
    return (
        <p className={`${styles.root} ${styles[size]} ${styles[variant]}`}>{text}</p>
    )
}

export default Typography;
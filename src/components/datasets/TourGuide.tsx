import { TOUR_STEP_IDS } from '@/lib/tour-constants';
import { TourAlertDialog, TourStep, useTour } from '../tour';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

const steps: TourStep[] = [
    {
        content: <div>Edit or drop database here</div>,
        selectorId: TOUR_STEP_IDS.DATABASE_EDITOR,
        position: 'right',
        onClickWithinArea: () => {},
    },
    {
        content: <div>Add new collection</div>,
        selectorId: TOUR_STEP_IDS.ADD_NEW_COLLECTION,
        position: 'right',
        onClickWithinArea: () => {},
    },
    {
        content: <div>Edit or drop collection here</div>,
        selectorId: TOUR_STEP_IDS.COLLECTION_EDITOR,
        position: 'bottom',
        onClickWithinArea: () => {},
    },
    {
        content: <div>View Published state</div>,
        selectorId: TOUR_STEP_IDS.PUBLISHED_STATE,
        position: 'right',
        onClickWithinArea: () => {},
    },
    {
        content: <div>Import JSON or CSV</div>,
        selectorId: TOUR_STEP_IDS.IMPORT_FILE,
        position: 'left',
        onClickWithinArea: () => {},
    },
    {
        content: <div>Save changes</div>,
        selectorId: TOUR_STEP_IDS.SAVE_CHANGES,
        position: 'left',
        onClickWithinArea: () => {},
    },
];

const TourGuide = () => {
    const { setSteps } = useTour();
    const [openTour, setOpenTour] = useState(false);
    const [cookies, setCookie] = useCookies(['tour']);

    useEffect(() => {
        if (cookies.tour) {
            return;
        }

        setSteps(steps);
        const timer = setTimeout(() => {
            setOpenTour(true);
        }, 100);

        setCookie('tour', 1);

        return () => clearTimeout(timer);
    }, [setSteps]);

    return (
        <div>
            <TourAlertDialog isOpen={openTour} setIsOpen={setOpenTour} />
        </div>
    );
};

export default TourGuide;

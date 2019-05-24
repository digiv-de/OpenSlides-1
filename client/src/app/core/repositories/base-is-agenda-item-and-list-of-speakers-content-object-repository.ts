import { TranslateService } from '@ngx-translate/core';

import { BaseModel, ModelConstructor } from '../../shared/models/base/base-model';
import { BaseRepository } from './base-repository';
import {
    isBaseIsAgendaItemContentObjectRepository,
    IBaseIsAgendaItemContentObjectRepository
} from './base-is-agenda-item-content-object-repository';
import {
    isBaseIsListOfSpeakersContentObjectRepository,
    IBaseIsListOfSpeakersContentObjectRepository
} from './base-is-list-of-speakers-content-object-repository';
import { DataStoreService } from '../core-services/data-store.service';
import { DataSendService } from '../core-services/data-send.service';
import { ViewModelStoreService } from '../core-services/view-model-store.service';
import { Item } from 'app/shared/models/agenda/item';
import { ListOfSpeakers } from 'app/shared/models/agenda/list-of-speakers';
import { CollectionStringMapperService } from '../core-services/collection-string-mapper.service';
import {
    TitleInformationWithAgendaItem,
    IBaseViewModelWithAgendaItem
} from 'app/site/base/base-view-model-with-agenda-item';
import { BaseProjectableViewModel } from 'app/site/base/base-projectable-view-model';
import { IBaseViewModelWithListOfSpeakers } from 'app/site/base/base-view-model-with-list-of-speakers';

export function isBaseIsAgendaItemAndListOfSpeakersContentObjectRepository(
    obj: any
): obj is BaseIsAgendaItemAndListOfSpeakersContentObjectRepository<any, any, any> {
    return (
        !!obj && isBaseIsAgendaItemContentObjectRepository(obj) && isBaseIsListOfSpeakersContentObjectRepository(obj)
    );
}

/**
 * The base repository for objects with an agenda item and a list of speakers. This is some kind of
 * multi-inheritance by implementing both inherit classes again...
 */
export abstract class BaseIsAgendaItemAndListOfSpeakersContentObjectRepository<
    V extends BaseProjectableViewModel & IBaseViewModelWithAgendaItem & IBaseViewModelWithListOfSpeakers & T,
    M extends BaseModel,
    T extends TitleInformationWithAgendaItem
> extends BaseRepository<V, M, T>
    implements
        IBaseIsAgendaItemContentObjectRepository<V, M, T>,
        IBaseIsListOfSpeakersContentObjectRepository<V, M, T> {
    public constructor(
        DS: DataStoreService,
        dataSend: DataSendService,
        collectionStringMapperService: CollectionStringMapperService,
        viewModelStoreService: ViewModelStoreService,
        translate: TranslateService,
        baseModelCtor: ModelConstructor<M>,
        depsModelCtors?: ModelConstructor<BaseModel>[]
    ) {
        super(
            DS,
            dataSend,
            collectionStringMapperService,
            viewModelStoreService,
            translate,
            baseModelCtor,
            depsModelCtors
        );
        if (!this.depsModelCtors) {
            this.depsModelCtors = [];
        }
        this.depsModelCtors.push(Item);
        this.depsModelCtors.push(ListOfSpeakers);
    }

    public getAgendaListTitle(titleInformation: T): string {
        // Return the agenda title with the model's verbose name appended
        const numberPrefix = titleInformation.agenda_item_number ? `${titleInformation.agenda_item_number} · ` : '';
        return numberPrefix + this.getTitle(titleInformation) + ' (' + this.getVerboseName() + ')';
    }

    public getAgendaSlideTitle(titleInformation: T): string {
        const numberPrefix = titleInformation.agenda_item_number ? `${titleInformation.agenda_item_number} · ` : '';
        return numberPrefix + this.getTitle(titleInformation);
    }

    public getListOfSpeakersTitle = (titleInformation: T) => {
        return this.getAgendaListTitle(titleInformation);
    };

    public getListOfSpeakersSlideTitle = (titleInformation: T) => {
        return this.getAgendaSlideTitle(titleInformation);
    };

    protected createViewModelWithTitles(model: M): V {
        const viewModel = super.createViewModelWithTitles(model);
        viewModel.getAgendaListTitle = () => this.getAgendaListTitle(viewModel);
        viewModel.getAgendaSlideTitle = () => this.getAgendaSlideTitle(viewModel);
        viewModel.getListOfSpeakersTitle = () => this.getListOfSpeakersTitle(viewModel);
        viewModel.getListOfSpeakersSlideTitle = () => this.getListOfSpeakersSlideTitle(viewModel);
        return viewModel;
    }
}